const { instance } = require("../config/razorpay")
const Course = require("../models/Course")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const { courseEnrollmentEmail } = require("../mail/courseEnrollmentEmail")
const CourseProgress = require("../models/CourseProgress")
const crypto = require("crypto")

// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  const { courses } = req.body
  const userId = req.user.id

  // console.log("capturePayment: Received courses:", courses);
  // console.log("capturePayment: User ID:", userId);

  if (courses.length === 0) {
    // console.log("capturePayment: No courses provided.");
    return res.json({
      success: false,
      message: "Please Provide Course ID",
    })
  }

  let totalAmount = 0
  for (const course_id of courses) {
    let course
    try {
      course = await Course.findById(course_id)
      if (!course) {
        // console.log("capturePayment: Course not found:", course_id);
        return res.status(200).json({
          success: false,
          message: "Could not find the course",
        })
      }

      const uid = await User.findById(userId)
      if (course.studentsEnrolled.includes(uid._id)) {
        // console.log("capturePayment: Student already enrolled in course:", course_id);
        return res.status(200).json({
          success: false,
          message: "Student is already Enrolled in this Course",
        })
      }

      totalAmount += course.price
    } catch (error) {
      // console.log("capturePayment: Error calculating total amount or finding course:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  // console.log("capturePayment: Total amount:", totalAmount);

  const options = {
    amount: totalAmount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
    notes: {
      customerId: userId,
      courses: JSON.stringify(courses),
    },
  }

  try {
    const paymentResponse = await instance.orders.create(options)
    // console.log("capturePayment: Razorpay order created:", paymentResponse);
    res.status(200).json({
      success: true,
      message: "Payment details captured successfully",
      data: paymentResponse,
    })
  } catch (error) {
    // console.log("capturePayment: Error creating Razorpay order:", error);
    res.status(500).json({
      success: false,
      message: "Could not initiate order.",
    })
  }
}

// verify the payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature = req.body?.razorpay_signature
  const courses = req.body?.courses
  const userId = req.user.id

  // console.log("verifyPayment: Received details:", { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses, userId });

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    // console.log("verifyPayment: Missing required fields.");
    return res.status(400).json({
      success: false,
      message: "Payment Failed",
    })
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    // console.log("verifyPayment: Signature matched. Enrolling students...");
    const enrollResult = await enrollStudents(courses, userId)
    // console.log("verifyPayment: Enroll result:", enrollResult);

    if (enrollResult.success) {
      return res.status(200).json({
        success: true,
        message: "Payment Verified",
        data: enrollResult.data,
      })
    } else {
      return res.status(500).json({
        success: false,
        message: enrollResult.message,
      })
    }
  } else {
    // console.log("verifyPayment: Signature mismatch.");
    return res.status(400).json({
      success: false,
      message: "Payment Failed - Invalid Signature",
    })
  }
}

// enroll the student in the courses
const enrollStudents = async (courses, userId) => {
  // console.log("enrollStudents: Enrolling student with courses:", courses, "and userId:", userId);
  if (!courses || !userId) {
    return {
      success: false,
      message: "Please Provide Course ID and User ID",
    }
  }

  for (const courseId of courses) {
    try {
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      )

      // console.log("enrollStudents: Enrolled course update result:", enrolledCourse);

      if (!enrolledCourse) {
        return {
          success: false,
          message: "Course not Found",
        }
      }

      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        { $push: { courses: courseId } },
        { new: true }
      )

      // console.log("enrollStudents: Enrolled student update result:", enrolledStudent);

      if (!enrolledStudent) {
        return {
          success: false,
          message: "Student not found or could not be updated",
        }
      }

      await CourseProgress.create({
        courseId: courseId,
        userId: userId,
        completedVideos: [],
      })

      // console.log("enrollStudents: Course progress created for user:", userId, "course:", courseId);

      const emailResponse = await mailSender(
        enrolledStudent.email,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      )

      // console.log("enrollStudents: Email sent to student:", emailResponse);

    } catch (error) {
      // console.log("enrollStudents: Error during enrollment for course:", courseId, ":", error);
      return {
        success: false,
        message: error.message,
      }
    }
  }
  return {
    success: true,
    message: "Students Enrolled Successfully",
  }
}

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body
  const userId = req.user.id

  // console.log("sendPaymentSuccessEmail: Received details:", { orderId, paymentId, amount, userId });

  if (!orderId || !paymentId || !amount || !userId) {
    // console.log("sendPaymentSuccessEmail: Missing required fields.");
    return res.status(400).json({
      success: false,
      message: "Please Provide All the Details for Payment Success Email",
    })
  }

  try {
    const enrolledStudent = await User.findById(userId)
    if (!enrolledStudent) {
      // console.log("sendPaymentSuccessEmail: Student not found.");
      return res.status(404).json({
        success: false,
        message: "Student not found",
      })
    }

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      `Dear ${enrolledStudent.firstName},
        You have successfully paid for your course.
        Details:
        Order ID: ${orderId}
        Payment ID: ${paymentId}
        Amount: ${amount / 100}
        `
    )

    // console.log("sendPaymentSuccessEmail: Payment success email sent to:", enrolledStudent.email);

    return res.status(200).json({
      success: true,
      message: "Payment Success Email Sent",
    })
  } catch (error) {
    // console.log("sendPaymentSuccessEmail: Error sending payment success email:", error);
    return res.status(500).json({
      success: false,
      message: "Could not send email",
    })
  }
}