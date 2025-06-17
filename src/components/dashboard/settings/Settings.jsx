import React from 'react'
import ChangeProfileImg from './ChangeProfileImg'
import EditProfile from './EditProfile'
import UpdatePassword from './UpdatePassword'
import DeleteAccount from './DeleteProfile'

const Settings = () => {
  return (
    <div>
        <div className='text-2xl text-richblack-25'>
            <p>Edit Profile</p>
        </div>

        <ChangeProfileImg />

        <EditProfile />

        {/* <UpdatePassword /> */}

        <DeleteAccount />
        

    </div>
  )
}

export default Settings