import React, { useState } from 'react'
import { sidebarLinks } from '../../data/dashboard-links'
import SidebarLinks from './SidebarLinks'
import { logout } from '../../services/operations/authAPI'
import { useDispatch, useSelector } from 'react-redux'
import { VscSignOut } from 'react-icons/vsc'
import { useNavigate } from 'react-router-dom'
import ConfirmationModal from "../core/ConfirmationModal"



const Sidebar = () => {
  
    const {user, loading: profileLoading } = useSelector((state) => state.profile);
    const {loading: authLoading} = useSelector((state) => state.auth)
    const [confirmationModal, setConfirmationModal] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    if (profileLoading || authLoading) {
        // console.log("Profile Loading: ", profileLoading)
        // console.log("Auth Loading: ", authLoading)
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
    }
  
    return (
        <div className='flex min-w-[220px] min-h-[calc(100vh-3.5rem)] flex-col border-r-1px border-r-richblack-700
        bg-richblack-800 py-10 text-white'>
            <div className='flex flex-col'>
            {
                sidebarLinks.map((link) => {
                    if(link.type && user?.accountType !== link.type) return null;
                    return (
                        <SidebarLinks key={link.id} link={link} iconName={link.icon}/>
                    )
                })
            }                
            </div>

            <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />
            <div className="flex flex-col">
                <SidebarLinks
                    link={{ name: "Settings", path: "/dashboard/settings" }}
                    iconName="VscSettingsGear"
                />
                <button
                    onClick={() =>
                    setConfirmationModal({
                        text1: "Are you sure?",
                        text2: "You will be logged out of your account.",
                        btn1Text: "Logout",
                        btn2Text: "Cancel",
                        btn1Handler: () => dispatch(logout(navigate)),
                        btn2Handler: () => setConfirmationModal(null),
                    })
                    }
                    className="px-8 py-2 text-sm font-medium text-richblack-300"
                >
                    <div className="flex items-center gap-x-2">
                    <VscSignOut className="text-lg" />
                    <span>Logout</span>
                    </div>
                </button>
            </div>
            {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
        </div>
  )
}

export default Sidebar