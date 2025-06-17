import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import RenderSteps from '../addCourse/RenderSteps';
import { getFullDetailsOfCourse } from '../../../services/operations/courseDetailsAPI'
import { setEditCourse } from '../../../slices/courseSlice';
import { setCourse } from '../../../slices/courseSlice';

const EditCourse = () => {
  
    const dispatch = useDispatch();
    const { courseId } = useParams()
    const {course, editCourse: isEditCourse} = useSelector((state) => state.course)
    const [loading, setLoading] = useState(false);
    const {token} = useSelector((state) => state.auth)
  
    useEffect(() => {
        ;(async () => {
          setLoading(true)
          // console.log("EditCourse - Course Id from useParams:", courseId);
          const result = await getFullDetailsOfCourse(courseId, token)
          if (result?.data?.courseDetails) {
            dispatch(setEditCourse(true))
            dispatch(setCourse(result?.data?.courseDetails))
            // console.log("EditCourse - Course from Redux after fetch:", result?.data?.courseDetails);
          }
          setLoading(false)
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // console.log("EditCourse - Current course state in component:", course);
    // console.log("EditCourse - Current isEditCourse state:", isEditCourse);

    if (loading) {
        return (
          <div className="grid flex-1 place-items-center">
            <div className="spinner"></div>
          </div>
        )
      }

    return (
    <div>
        <h1 className="mb-14 text-3xl font-medium text-richblack-5">
          Edit Course
        </h1>
        <div className="mx-auto max-w-[600px]">
          {course ? (
            <RenderSteps />
          ) : (
            <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
              Course not found
            </p>
          )}
        </div>
    </div>
  )
}

export default EditCourse