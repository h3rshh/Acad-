import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPasswordResetToken } from '../services/operations/authAPI';

const ForgotPassword = () => {
  
    const { loading } = useSelector( (state) => state.auth);
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const dispacth = useDispatch();

    const handleOnSubmit = (e) => {
        e.preventDefault()
        dispacth(getPasswordResetToken(email, setEmailSent))
    }

    return (
    <div className="grid min-h-[calc(90vh-3.15rem)] place-items-center"> 
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="max-w-[450px] p-4 lg:p-7"> 
            <h1 className="text-[1.6875rem] font-semibold leading-[2.1375rem] text-richblack-5"> 
                {!emailSent ? "Reset your password" : "Check email"}
            </h1>
            <p className="my-4 text-[1.0125rem] leading-[1.4625rem] text-richblack-100"> 
                {!emailSent
                ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
                : `We have sent the reset email to ${email}`}
            </p>


            <form onSubmit={handleOnSubmit}>
                {!emailSent && (
                <label className="w-full">
                    <p className="mb-1 text-[0.7875rem] leading-[1.2375rem] text-richblack-5"> 
                    Email Address <sup className="text-pink-200">*</sup>
                    </p>
                    <input
                    required
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="form-style w-full"
                    />
                </label>
                )}
                <button
                type="submit"
                className="mt-5 w-full rounded-[7px] bg-yellow-50 py-[11px] px-[11px] font-medium text-richblack-900" 
                >
                {!emailSent ? "Sumbit" : "Resend Email"}
                </button>
            </form>

        </div>
        )
    }
    </div>
    ) 
}

export default ForgotPassword