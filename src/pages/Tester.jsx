import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addCourseDetails } from '../services/operations/courseDetailsAPI'
import { fetchCourseDetails } from '../services/operations/courseDetailsAPI'
import { createSection } from '../services/operations/courseDetailsAPI'
import { updateSection, deleteSection, createSubSection, getFullDetailsOfCourse, fetchInstructorCourses, editCourseDetails, updateSubSection, deleteSubSection, deleteCourse, fetchCourseCategories, createRating } from '../services/operations/courseDetailsAPI'
import { getUserEnrolledCourses, getUserDetails } from '../services/operations/profileAPI'
import { updateDisplayPicture, deleteProfile, updateProfile } from '../services/operations/settingsApi'
import { setCourseSectionData } from '../slices/viewCourseSlice'
import img  from "../assets/Images/default.png"
import { useNavigate } from 'react-router-dom'
import { profileEndpoints } from '../services/apis'
import { getInstructorData } from '../services/operations/profileAPI'
import { getCatalogPageData } from '../services/operations/pageAndComponentData'

const Tester = () => {
    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.auth)
    const navigate = useNavigate()

    useEffect(() => { 
        console.log("Token : ", token)
        const catId = "67f3dd79fcdb3676646cdddc"
        
        const getcatdetails = async() => {
            const res = await getCatalogPageData(catId)
            console.log("Course full details : ", res)
        }
        getcatdetails()
    },[])

    return (
        <div className='text-4xl text-richblack-100 flex justify-center'>
            Tester Page Loaded
        </div>
    )
}

export default Tester




// Create Course
// const Tester = () => {
//     const dispatch = useDispatch()
//     const { token } = useSelector((state) => state.auth)

//     const formData = new FormData()
//     formData.append("courseName", "html title")
//     formData.append("courseDescription", "html desc")
//     formData.append("price", "100")
//     formData.append("tag", "good")
//     formData.append("whatYouWillLearn", "a log")
//     formData.append("category", "6765317e2cdb5a3e11b9aae1")
//     formData.append("status", "Published")
//     formData.append("instructions", "kcuh nhi")
//     formData.append("thumbnailImage", "12")

//     useEffect( () => {
//         const call = async() => {
//             console.log("Entered Tester Use Effect: ", token)
//             const res = await addCourseDetails(formData, token)
//             console.log("res : ", res)
//         }
//         call()
//     }, [])
//   return (
//     <div className='text-4xl text-richblack-100'>
//         Tester Page Loaded
//     </div>
//   )
// }

// Get COurse details
// const cid = "67daf642f552704e8f5314be"
//     useEffect(() => {
//         const fetchCourseDet = async() => {
//             const res = await fetchCourseDetails(cid)
//             console.log("Course Details : ", res)
//         }
//         fetchCourseDet()
//     },[])

// Create section
// const { token } = useSelector((state) => state.auth)
//     useEffect(() => { 
//         console.log("Token : ", token)
//         const createsectn = async() => {
//             const res = await createSection({
//                 sectionName: "cpp first section" ,
//                 courseId: "67460a65f195198b0f8cf7e2",
//               }, token)
//             console.log("Course Details : ", res)
//         }
//         createsectn()
//     },[])

// update section
// const { token } = useSelector((state) => state.auth)
// useEffect(() => { 
//     console.log("Token : ", token)
//     const updtsection = async() => {
//         const res = await updateSection({
//             sectionName: "second cpp section",
//             sectionId: "67dbab19160f38654f248a63"
//         }, token)
//     }
//     updtsection()
// },[])

// delete section
// const { token } = useSelector((state) => state.auth)
//     useEffect(() => { 
//         console.log("Token : ", token)
//         const delsection = async() => {
//             const res = await deleteSection({
//                 "sectionId": "67dbab1c160f38654f248a6b",
//                 "courseId":  "67460a65f195198b0f8cf7e2"
//             }, token)
//         }
//         delsection()
//     },[])

// add sub section
// const { token } = useSelector((state) => state.auth)
//     useEffect(() => { 
//         console.log("Token : ", token)
//         const addsubsec = async() => {
//             const res = createSubSection({
//                 "sectionId": "67dbab19160f38654f248a61",
//                 "title": "haha2",
//                 "description": "hahaha"
//             }, token);
//             console.log("Result : ", res)
//         }
//         addsubsec()
//     },[])

// get full details of course
// const { token } = useSelector((state) => state.auth)
// useEffect(() => { 
//     console.log("Token : ", token)
//     const courseId = "67daf6a6f552704e8f5314d2" 
//     const fulldet = async() => {
//         const res = await getFullDetailsOfCourse(courseId, token)
//         console.log("Course full details : ", res)
//     }
//     fulldet()
// },[])

// edit course details
// const { token } = useSelector((state) => state.auth)
//     useEffect(() => { 
//         console.log("Token : ", token)
//         const editcs = async() => {
//             const res = await editCourseDetails({
//                 "courseId": "67daf6a6f552704e8f5314d2",
//                 "tag": ["lalalawa3", "haha3"],
//                 "instructions": ["lalalalawa3", "haha3"]
//             }, token)
//         }
//         editcs()
//     },[])

// get all instructor courses
// const { token } = useSelector((state) => state.auth)
//     useEffect(() => { 
//         console.log("Token : ", token)
//         const instrcourses = async() => {
//             const res = await fetchInstructorCourses(token)
//             console.log("instructor courses  : ", res)
//         }
//         instrcourses()
//     },[])

// update sub section
// const { token } = useSelector((state) => state.auth)
// useEffect(() => { 
//     console.log("Token : ", token)
//     const updsubsesction = async() => {
//         const res = await updateSubSection({
//             sectionId: "67dbab19160f38654f248a61", 
//             subSectionId: "67dbe62c8defb1e485742947", 
//             title: "bwabwa2", 
//             description: "bwabwa2"
            
//         }, token)
//         console.log("updated subsec  : ", res)
//     }
//     updsubsesction()
// },[])

// delete subsection
// const { token } = useSelector((state) => state.auth)
//     useEffect(() => { 
//         console.log("Token : ", token)
//         const delsubsec = async() => {
//             const res = await deleteSubSection({
//                 sectionId: "67dbab19160f38654f248a61",
//                 subSectionId: "67dbe4bbb113f57693b96345"
//             }, token)
//             console.log("Result : ", res)   
//         }
//         delsubsec()
//     },[])

// delete course
// const { token } = useSelector((state) => state.auth)
// useEffect(() => { 
//     const delcourse = async() => {
//         console.log("Token : ", token)
//         const res = await deleteCourse({
//             courseId: "67db92967ea89a112d36e6dd"
//         }, token)
//         console.log("Result : ", res)   
//     }
//     delcourse()
// },[])

// fetch all course categories
// const { token } = useSelector((state) => state.auth)
//     useEffect(() => { 
//         const fetchcoursecats = async() => {
//             console.log("Token : ", token)
//             const res = await fetchCourseCategories()
//             console.log("Res : ", res)
//         }
//         fetchcoursecats()
//     },[])

// create review
// const { token } = useSelector((state) => state.auth)
//     useEffect(() => { 
//         const createrating = async() => {
//             const res = await createRating({
//                 "courseId": "6763c93fa22874110713d7b5",
//                 "rating": "8",
//                 "review": "decent enough"
//             }, token)
//             console.log("Res : ", res)
//         }
//         createrating()
//     },[])


// get user enrolled courses 
// const { token } = useSelector((state) => state.auth)
//     useEffect(() => { 
//         const getuserenrolledcourses = async() => {
//             const res = await getUserEnrolledCourses(token)
//             console.log("Res : ", res)
//         }
//         getuserenrolledcourses()
//     },[])


// Upload Profile Photo (Error uploading empty white photos)
// const { token } = useSelector((state) => state.auth)
//     const dispatch = useDispatch()
//     useEffect(() => { 
//         console.log("Enter Update Pic useeffect")
//         const updateprofilepic = () => {
//             try{
//                 const formData = new FormData()
//                 formData.append("displayPicture", img)
//                 dispatch(updateDisplayPicture(token, formData)).then(() =>{
//                     console.log("Update display pic done")
//                 })
//             } catch(error){
//                 console.log("ERROR MESSAGE - ", error.message)
//             }
//         }
//         updateprofilepic()
//     },[])


// Delete profile
// navigate = useNavigate()
// useEffect(() => { 
//     const delprofile = () => {
//         console.log("Entered delete profile tester")
//         try{
//             dispatch(deleteProfile(token, navigate)).then(() =>{
//                 console.log("Update display pic done")
//             })
//         } catch(error){
//             console.log("ERROR MESSAGE - ", error.message)
//         }
//     }
//     delprofile()
// },[])


// update profile
// useEffect(() => { 
//     const updprofile = () => {
//         console.log("Entered update profile tester")
//         const data = {
//             "gender": "female",
//             "contactNumber": "2342342342",
//             "about": "about my profile"
//         }
//         try{
//             dispatch(updateProfile(token, data)).then(() =>{
//                 console.log("Update profile done")
//             })
//         } catch(error){
//             console.log("ERROR MESSAGE - ", error.message)
//         }
//     }
//     updprofile()
// },[])


// get user profile details
// useEffect(() => { 
//     const updprofile = () => {
//         console.log("Entered update profile tester")
//         const data = {
//             "gender": "female",
//             "contactNumber": "2342342342",
//             "about": "about my profile"
//         }
//         try{
//             dispatch(getUserDetails(token, navigate)).then(() =>{
//                 console.log("Gotten user details")
//             })
//         } catch(error){
//             console.log("ERROR MESSAGE - ", error.message)
//         }
//     }
//     updprofile()
// },[])


// get instructor data
// useEffect(() => { 
//     const getinstructordata = async() => {
//         console.log("Entered update profile tester")
        
//         try{
//             const res = await getInstructorData(token);
//         } catch(error){
//             console.log("ERROR MESSAGE - ", error.message)
//         }
//     }
//     getinstructordata()
// },[])