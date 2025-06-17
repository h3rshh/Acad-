import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import {fetchCourseCategories, editCourseDetails, addCourseDetails} from "../../../../services/operations/courseDetailsAPI"
import { toast } from "react-hot-toast"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import ChipInput from './ChipInput'
import Upload from '../Upload'
import RequirementsField from './RequirementsField'
import IconBtn from "../../../core/IconBtn"
import { MdNavigateNext } from "react-icons/md"
import { apiConnector } from '../../../../services/apiconnector'
import { categories } from "../../../../services/apis"
import { setCourse, setStep } from "../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../utils/constants"


const CourseInformationForm = () => {
  
    const { token } = useSelector((state) => state.auth)
    const {register, handleSubmit, setValue, getValues, formState:{errors},} = useForm()
    const dispatch = useDispatch()
    const { course, editCourse } = useSelector((state) => state.course);
    const [loading, setLoading] = useState(false);
    const [courseCategories, setCourseCategories] = useState([]);

    useEffect(() => {
        const getCategories = async() => {
          setLoading(true)
          // const categories = await fetchCourseCategories()

          const res = await apiConnector("GET", categories.CATEGORIES_API)
          // console.log("Result : ", res.data.allCategories)
          const cats = res.data.allCategories
          if(cats.length > 0){
            // console.log("Categories found CourseInfoForm : ",cats)
            setCourseCategories(cats)
          }
          else{ 
            // console.log("Categories not found course info form")
          }
          setLoading(false)
        }

        if(editCourse){
          setValue("courseTitle", course.courseName)
          setValue("courseDescription", course.courseDescription)
          setValue("courseBenefits", course.whatYouWillLearn)
          setValue("coursePrice", course.price)
          setValue("courseTags", course.tag)
          setValue("courseCategory", course.category)
          setValue("courseInstructions", course.instructions)
          setValue("courseThumbnail", course.thumbnail)
        }

        getCategories()
    }, [])

    const isFormUpdated = () => {
      const currentValues = getValues()
      // console.log("changes after editing form values:", currentValues)
      if (true
        // currentValues.courseTitle !== course.courseName ||
        // currentValues.courseDescription !== course.courseDescription ||
        // currentValues.coursePrice !== course.price ||
        // currentValues.courseTags.toString() !== course.tag.toString() ||
        // currentValues.courseBenefits !== course.whatYouWillLearn ||
        // currentValues.courseCategory._id !== course.category._id ||
        // currentValues.courseInstructions.toString() !==
        //   course.instructions.toString() ||
        // currentValues.courseThumbnail !== course.thumbnail
      ) {
        return true
      }
      return false
    }

    const onSubmit = async (data) => {
      // console.log(data)
  
      if (editCourse) {
        const currentValues = getValues()
        // console.log("changes after editing form values:", currentValues)
        // console.log("now course:", course)
        // console.log("Has Form Changed:", isFormUpdated())
        if (isFormUpdated()) {
          const currentValues = getValues()
          const formData = new FormData()
          // console.log(data)
          formData.append("courseId", course._id)
          if (currentValues.courseTitle !== course.courseName) {
            formData.append("courseName", data.courseTitle)
          }
          if (currentValues.courseDescription !== course.courseDescription) {
            formData.append("courseDescription", data.courseDescription)
          }
          if (currentValues.coursePrice !== course.price) {
            formData.append("price", data.coursePrice)
          }
          if (currentValues.courseTags.toString() !== course.tag.toString()) {
            formData.append("tag", JSON.stringify(data.courseTags))
          }
          if (currentValues.courseBenefits !== course.whatYouWillLearn) {
            formData.append("whatYouWillLearn", data.courseBenefits)
          }
          if (currentValues.courseCategory._id !== course.category._id) {
            formData.append("category", data.courseCategory)
          }
          if (
            currentValues.courseInstructions.toString() !==
            course.instructions.toString()
          ) {
            formData.append(
              "instructions",
              JSON.stringify(data.courseInstructions)
            )
          }
          if (currentValues.courseThumbnail !== course.thumbnail) {
            formData.append("thumbnailImage", data.courseThumbnail)
          }
          // console.log("Edit Form data: ", formData)
          setLoading(true)
          const result = await editCourseDetails(formData, token)
          setLoading(false)
          if (result) {        
            // console.log("Result of step1 true: ", result)
            dispatch(setStep(2))
            dispatch(setCourse(result))
          }
        } else {
          toast.error("No changes made to the form")
        }
        return
      }

      // Create a new course
      const formData = new FormData()
      formData.append("courseName", data.courseTitle)
      formData.append("courseDescription", data.courseDescription)
      formData.append("price", data.coursePrice)
      formData.append("tag", JSON.stringify(data.courseTags))
      formData.append("whatYouWillLearn", data.courseBenefits)
      formData.append("category", data.courseCategory)
      // formData.append("status", COURSE_STATUS.DRAFT)
      formData.append("instructions", JSON.stringify(data.courseInstructions))
      formData.append("thumbnailImage", data.courseThumbnail)
      setLoading(true)
      const result = await addCourseDetails(formData, token)
      // console.log("Result of step1 : ", result)
      if (result) {
        // console.log("Result of step1 true: ", result)
        dispatch(setStep(2))
        dispatch(setCourse(result))
      }
      setLoading(false)
    }
  
    return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >

      <div className="flex flex-col space-y-2">
        <label htmlFor='courseTitle' className="text-sm text-richblack-5">Course Title <sup className="text-pink-200">*</sup></label>
        <input 
          id='courseTitle'
          placeholder='Enter Course Title'
          {...register("courseTitle", {required: true})}
          className="form-style w-full"

        />
        {
          errors.courseTitle && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">Course Title Is Required **</span>
          )
        }
      </div>
 
      <div className="flex flex-col space-y-2">
        <label htmlFor='courseDescription' className="text-sm text-richblack-5">Course Description <sup>*</sup></label>
        <textarea
          id='courseDescription'
          placeholder='Enter Course Description'
          {...register("courseDescription", {required: true})}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {
          errors.courseDescription && (
            <span>Course Description Is Required **</span>
          )
        }
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor='coursePrice' className="text-sm text-richblack-5">Course Price <sup className="text-pink-200">*</sup></label>
        <div className='relative'>
          <input
            id='coursePrice'
            placeholder='Enter Course Price'
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full !pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        
        {
          errors.coursePrice && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Course Price Is Required **
            </span>
          )
        }
      </div>
      
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor='courseCategory'>Course Category <sup className="text-pink-200">*</sup></label>
        <select 
          name="courseCategory" 
          id="courseCategory"
          defaultValue=""
          {...register("courseCategory", { required: true })}
          className="form-style w-full"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {
            // console.log("Loading: ", loading, " , cats : ", courseCategories)
          }
          {!loading &&
            courseCategories.map((category, index) => {
              // console.log("Category : ", category);
              return (
                <option key={index} value={category?._id}>
                  {category.name}
                </option>
              );
            })}
        </select>

        {
          errors.courseCategory && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Please select course category
            </span>
          )
        }
      </div>

      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      {/* Course Thumbnail Image */}
      <Upload
        name="courseThumbnail"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />

      <div className="flex flex-col space-y-2">
        <label htmlFor='courseBenefits' className="text-sm text-richblack-5">Course Benefits <sup className="text-pink-200">*</sup></label>
        <textarea
          id='courseBenefits'
          placeholder='Enter Course Benefits'
          {...register("courseBenefits", {
            required: true,
          })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {
          errors.coursePrice && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Course Benefits are Required **
            </span>
          )
        }
      </div>

      <RequirementsField
        name="courseInstructions"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />

      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
          >
            Continue Wihout Saving
          </button>
        )}
        <IconBtn
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>

    </form>
  )
}

export default CourseInformationForm