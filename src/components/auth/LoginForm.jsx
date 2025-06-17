import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../../services/operations/authAPI";

function LoginForm() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const { email, password } = formData

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password, navigate));
  };

  const handleOnChange = (e) => {
    setFormData( (prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value
    }))
  };

  return (
    <form
      onSubmit={handleOnSubmit}
      className="mt-5 flex w-full flex-col gap-y-3" // Reduced mt-6 to mt-5, gap-y-4 to gap-y-3
    >
      <label className="w-full">
        <p className="mb-1 text-[0.75rem] leading-[1.125rem] text-richblack-5"> {/* Reduced text size and leading */}
          Email Address <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="text"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.425rem] bg-richblack-800 p-[10px] text-richblack-5" // Reduced rounded and padding
        />
      </label>
      <label className="relative">
        <p className="mb-1 text-[0.75rem] leading-[1.125rem] text-richblack-5"> {/* Reduced text size and leading */}
          Password <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter Password"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.425rem] bg-richblack-800 p-[10px] pr-10 text-richblack-5" // Reduced rounded and padding
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[32px] z-[10] cursor-pointer" // Reduced top position
        >
          {showPassword ? (
            <AiOutlineEyeInvisible fontSize={20} fill="#AFB2BF" /> 
          ) : (
            <AiOutlineEye fontSize={20} fill="#AFB2BF" /> 
          )}
        </span>
        <Link to="/forgot-password">
          <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
            Forgot Password
          </p>
        </Link>
      </label>
      <button
        type="submit"
        className="mt-5 rounded-[7px] bg-yellow-50 py-[7px] px-[10px] font-medium text-richblack-900" // Reduced mt-6 to mt-5, rounded, padding
      >
        Sign In
      </button>
    </form>
  );
}

export default LoginForm;