// import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/core/Navbar'
import ForgotPassword from './pages/ForgotPassword'
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Error from "./pages/Error"
import VerifyEmail from './pages/VerifyEmail'
import UpdatePassword from './pages/UpdatePassword'
import About from './pages/About'
import Signup from './pages/Signup'
import Contact from './pages/Contact'
import Settings from './components/dashboard/settings/Settings'
import EnrolledCourses from './components/dashboard/EnrolledCourses'
import DashboardCart from './components/dashboard/DashboardCart'
import AddCourse from './components/dashboard/addCourse/AddCourse'
import Tester from "./pages/Tester"
import CourseDetails from './pages/CourseDetails'
import ViewCourse from './pages/ViewCourse'
import VideoDetails from './components/view/VideoDetails'
import Instructor from './components/dashboard/InstructorDashboard/Instructor'

import './App.css'
import { ACCOUNT_TYPE } from './utils/constants'
import OpenRoute from './components/core/OpenRoute'
import PrivateRoute from './components/core/PrivateRoute'
import MyProfile from './components/dashboard/MyProfile'
import { useSelector } from 'react-redux'
import MyCourses from './components/dashboard/MyCourses'
import EditCourse from './components/dashboard/EditCourse'
import Catalog from './pages/Catalog'

function App() {

  const { user } = useSelector(state => state.profile)

  return (

    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
      
      <Navbar />

      <Routes>

        <Route path='/' element={<Home/>} />

        <Route path='/catalog/:catalogPage' element={<Catalog />} />

        <Route path='/courses/:courseId' element={<CourseDetails />} />

        {/* View Course routes: Corrected path for parent Route */}
        <Route 
          element={<PrivateRoute><ViewCourse /> </PrivateRoute>}
          path='/view-course/:courseId'
        >
          <Route index element={<div className="flex h-full w-full items-center justify-center">
            <div className="text-richblack-5 text-xl">Select a lecture to start learning</div>
          </div>} />
          <Route path='section/:sectionId/sub-section/:subSectionId' element={<VideoDetails />} />
        </Route>

        <Route path='/tester' element={<Tester />} />

        <Route
          path="login"
          element={<OpenRoute> <Login /> </OpenRoute>}
        />

        <Route
          path="signup"
          element={<OpenRoute> <Signup /> </OpenRoute>}
        />

        <Route 
          path="forgot-password"
          element={<OpenRoute> <ForgotPassword /> </OpenRoute>}
        />

        <Route 
          path="verify-email"
          element={<OpenRoute> <VerifyEmail /> </OpenRoute>}
        />

        <Route 
          path="update-password/:id"
          element={<OpenRoute> <UpdatePassword /> </OpenRoute>}
        />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route 
          element={<PrivateRoute><Dashboard /> </PrivateRoute>}
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/settings" element={<Settings /> } />
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
              <Route path="dashboard/cart" element={<DashboardCart />} />
              <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/my-courses" element={< MyCourses/>} />
              <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} />
              <Route path="dashboard/instructor" element={<Instructor />} />
              </>
            )
          }



        </Route>

        

        <Route
          path="dashboard/settings"
          // element={<Settings />}
        />

        <Route
          path="*" element={<Error /> } 
        />

      </Routes>
    </div> 
  )
}

export default App
