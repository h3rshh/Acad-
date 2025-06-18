import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"
import { useSelector } from "react-redux"

import StarRating from "../core/StarRating"
import { createRating } from "../../services/operations/courseDetailsAPI"
import IconBtn from "../core/IconBtn"
import { FaStar } from "react-icons/fa"

export default function CourseReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { courseEntireData } = useSelector((state) => state.viewCourse)
  
  // Add state for rating to ensure it's captured properly
  const [rating, setRating] = useState(0)

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    setValue("courseExperience", "")
    setValue("courseRating", 0)
    setRating(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ratingChanged = (newRating) => {
    // console.log("Rating changed to:", newRating)
    setRating(newRating)
    setValue("courseRating", newRating)
  }

  const onSubmit = async (data) => {
    // Use the state value as fallback
    const finalRating = rating || data.courseRating
    
    console.log("Submitting review:", {
      courseId: courseEntireData._id,
      rating: finalRating,
      review: data.courseExperience,
    })

    await createRating(
      {
        courseId: courseEntireData._id,
        rating: finalRating,
        review: data.courseExperience,
      },
      token
    )
    setReviewModal(false)
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">Add Review</p>
          <button onClick={() => setReviewModal(false)}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        {/* Modal Body */}
        <div className="p-6">
          <div className="flex items-center justify-center gap-x-4">
            <img
              src={user?.image}
              alt={user?.firstName + "profile"}
              className="aspect-square w-[50px] rounded-full object-cover"
            />
            <div className="">
              <p className="font-semibold text-richblack-5">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-richblack-5">Posting Publicly</p>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex flex-col items-center"
          >
            {/* Fixed rating section with proper flex layout */}
            <div className="mb-4 flex flex-col items-center space-y-2">
              <label className="text-sm text-richblack-5">
                Rate this course <sup className="text-pink-200">*</sup>
              </label>
              <div 
                className="flex items-center justify-center gap-1" 
                style={{ display: 'flex', flexDirection: 'row' }}
              >
                <StarRating
                    rating={rating}
                    onRatingChange={ratingChanged}
                    size={28}
                /> 
              </div>
              {/* Display current rating */}
              <p className="text-xs text-richblack-300">
                Current Rating: {rating}/5
              </p>
            </div>

            <div className="flex w-11/12 flex-col space-y-2">
              <label
                className="text-sm text-richblack-5"
                htmlFor="courseExperience"
              >
                Add Your Experience <sup className="text-pink-200">*</sup>
              </label>
              <textarea
                id="courseExperience"
                placeholder="Share your learning experience with this course..."
                {...register("courseExperience", { 
                  required: "Please add your experience",
                  minLength: {
                    value: 10,
                    message: "Review must be at least 10 characters long"
                  }
                })}
                className="form-style resize-none min-h-[130px] w-full rounded-md border border-richblack-600 bg-richblack-700 p-3 text-richblack-5 placeholder-richblack-400 focus:border-yellow-50 focus:outline-none"
              />
              {errors.courseExperience && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                  {errors.courseExperience.message}
                </span>
              )}
            </div>
            
            {/* Add rating validation */}
            {rating === 0 && (
              <span className="mt-2 text-xs tracking-wide text-pink-200">
                Please provide a rating
              </span>
            )}

            <div className="mt-6 flex w-11/12 justify-end gap-x-2">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900 hover:bg-richblack-200 transition-colors"
              >
                Cancel
              </button>
              <IconBtn 
                text="Save" 
                type="submit"
                disabled={rating === 0}
                className={rating === 0 ? "opacity-50 cursor-not-allowed" : ""}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}