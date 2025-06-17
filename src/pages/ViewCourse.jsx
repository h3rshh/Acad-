import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"

import CourseReviewModal from "../components/view/CourseReviewModal"
import VideoDetailsSidebar from "../components/view/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"

import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice"

export default function ViewCourse() {
//   console.log("ViewCourse component rendered");
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [reviewModal, setReviewModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // console.log("ViewCourse useEffect triggered");
    const fetchCourseData = async () => {
      if (!courseId || !token) {
        // console.log("ViewCourse useEffect: Missing courseId or token");
        setError("Course ID or token is missing")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const courseData = await getFullDetailsOfCourse(courseId, token)
        // console.log("ViewCourse useEffect: Course Data fetched", courseData)
        
        if (!courseData?.data?.courseDetails) {
        //   console.log("ViewCourse useEffect: Course data not found in response");
          throw new Error("Course data not found")
        }

        dispatch(setCourseSectionData(courseData.data.courseDetails.courseContent))
        dispatch(setEntireCourseData(courseData.data.courseDetails))
        dispatch(setCompletedLectures(courseData.data.completedVideos))
        
        let lectures = 0
        courseData?.data?.courseDetails?.courseContent?.forEach((sec) => {
          lectures += sec.subSection.length
        })
        dispatch(setTotalNoOfLectures(lectures))
      } catch (error) {
        console.error("ViewCourse useEffect: Error fetching course data:", error)
        setError(error.message || "Failed to load course data")
      } finally {
        setLoading(false)
      }
    }

    fetchCourseData()
  }, [courseId, token, dispatch])

  if (loading) {
    // console.log("ViewCourse: Loading state");
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error) {
    // console.log("ViewCourse: Error state", error);
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="text-richblack-5 text-xl">
          {error}
        </div>
      </div>
    )
  }

//   console.log("ViewCourse: Rendering main content");
  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      <VideoDetailsSidebar setReviewModal={setReviewModal} />
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <div className="mx-6">
          <Outlet />
        </div>
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </div>
  )
}