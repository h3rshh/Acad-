import { FcGoogle } from "react-icons/fc";
import { useSelector } from "react-redux";
import frameImg from "../../assets/Images/frame.png";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

function Template({ title, description1, description2, image, formType }) {
  const { loading } = useSelector((state) => state.auth);

  return (
    <div className="grid min-h-[calc(100vh-3rem)] place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="mx-auto flex w-8/12 max-w-maxContent flex-col-reverse justify-between gap-y-10 py-10 md:flex-row md:gap-y-0 md:gap-x-4">
          <div className="mx-auto w-11/12 max-w-[400px] md:mx-0 ml">
            <h1 className="text-[1.625rem] font-semibold leading-[2rem] text-richblack-5">
              {title}
            </h1>
            <p className="mt-3 text-[1rem] leading-[1.375rem]">
              <span className="text-richblack-100">{description1}</span>{" "}
              <span className="font-edu-sa font-bold italic text-blue-100">
                {description2}
              </span>
            </p>
            {formType === "signup" ? <SignupForm /> : <LoginForm />}
          </div>
          <div className="relative mx-auto w-11/12 max-w-[400px] md:mx-0">
            <img
              src={frameImg}
              alt="Pattern"
              width={475}
              height={430}
              loading="lazy"
            />
            <img
              src={image}
              alt="Students"
              width={475}
              height={430}
              loading="lazy"
              className="absolute -top-3 right-3 z-10"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Template;