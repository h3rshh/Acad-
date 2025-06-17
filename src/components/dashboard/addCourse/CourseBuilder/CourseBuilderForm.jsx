import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import IconBtn from '../../../core/IconBtn';
import { MdAddCircleOutline } from 'react-icons/md';
import NestedView from './NestedView';
import { useDispatch, useSelector } from 'react-redux';
import { createSection, updateSection } from '../../../../services/operations/courseDetailsAPI';
import { toast } from "react-hot-toast"
import { setCourse, setEditCourse, setStep } from "../../../../slices/courseSlice"

const CourseBuilderForm = () => {
  
  const {register, handleSubmit, setValue, formState: {errors}} = useForm()
  const [editSectionName, setEditSectionName] = useState(null)
  const course = useSelector((state) => state.course)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const {token} = useSelector((state) => state.auth)

  const cancelEdit = () => {
    setEditSectionName(null)
    setValue("sectionName", "")
  }

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true))
  }

  const goToNext = () => {
    // console.log("CourseContent : ",course.courseContent)
    if(!course.course.courseContent || course.course.courseContent.length === 0){
      toast.error("Please add atleast one Section");
      return;
    }
    if(!course.course.courseContent || course.course.courseContent.some((section) => console.log("Section: ", section))){
      toast.error("Please add atleast one Lecture in each defined section");
      return; 
    }
    // Everything is good
    dispatch(setStep(3));
  }

  const onSubmit = async(data) => {
    // console.log("Course: ", course.course._id)
    setLoading(true);
    let result;

    if(editSectionName){
      result = await updateSection({
        sectionName: data.sectionName,
        sectionId: editSectionName, 
        courseId: course.course._id,
      }, token)
    }
    else{
      result = await createSection({
        sectionName: data.sectionName,
        courseId: course.course._id,
      }, token)
      // console.log("Result of create section : ", result)
    }

    if(result){
      dispatch(setCourse(result));
      // console.log("Course: ", course)
      // console.log("courseContent:", course?.courseContent);
      // console.log("Array.isArray(courseContent):", Array.isArray(course?.courseContent));
      // console.log("typeof courseContent:", typeof course?.courseContent);
      setEditSectionName(null);
      setValue("sectionName", "")
    }

    setLoading(false);
  }

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    // console.log("Entered handle change edit section name ")
    // console.log("Sectionid: ", sectionId)  
    // console.log(", section Name: ", sectionName,)
    // console.log(", old editSectionname: ", editSectionName)
    if(editSectionName === sectionId){
      cancelEdit();
      return ; 
    }
    setEditSectionName(sectionId)
    setValue("sectionName", sectionName);
  }

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
      <form className='space-y-4'
        onSubmit={handleSubmit(onSubmit)}
      > 
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="sectionName">
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="sectionName"
            disabled={loading}
            placeholder='Add Section Name'
            {...register("sectionName", {required: true})}
            className='w-full form-style'
          />
          {errors.sectionName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Section Name is required
            </span>
          )} 
        </div>

        <div className='flex items-end gap-x-4'>
          <IconBtn
            type="submit"
            disabled={loading}
            text={editSectionName ? "Edit Section Name": "Create Section"}
            outline={true}
            customClasses={"text-white"}
          >
            <MdAddCircleOutline className='text-yellow-50' size={20} />
          </IconBtn>
          {editSectionName && (
            <button
              type='button'
              onClick={cancelEdit}
              className='text-sm text-richblack-300 underline'
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* <NestedView 
        handleChangeEditSectionName={handleChangeEditSectionName}
      /> */}
      {course?.course?.courseContent?.length > 0 && (
        <NestedView 
          handleChangeEditSectionName={handleChangeEditSectionName}
        />
      )}

      <div className='flex justify-end gap-x-3'>
        <button
          onClick={goBack}
          className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
        >
          Back
        </button>

        <IconBtn disabled={loading} text="Next" onclick={goToNext}>
        </IconBtn>
      </div>

    </div>
  )
}

export default CourseBuilderForm