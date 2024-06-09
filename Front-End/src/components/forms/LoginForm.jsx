import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import backImage from '../../assets/back.png';
import authApi from "../../api/authApi";

const LoginForm = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  const inputClasses =
    "bg-[#EDEDEDED] py-4 px-6 placeholder:text-[#C1C1C1]  font-sans font-normal resize-none text-#C1C1C1 opacity-90 rounded-lg outline-none border-none font-medium";

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email")
        .required("Please enter your Email"),
      password: Yup.string().required("Please provide your Password"),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      // api request look alike

      // const res = await authApi.login(values);
      // console.log(res);

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    },
  });
  return (
    <div className="  max-w-[500px] mx-auto">
      <button onClick={() => navigate(-1)} className="fixed top-[100px] left-[120px]">
        <img src={backImage} alt="Back" className="h-8 w-8"/>
      </button>
      <h1 className="font-bold text-[#515151] text-4xl text-center"> LOG IN </h1>
      <form
        onSubmit={validation.handleSubmit}
        className=" flex flex-col gap-4 mt-9 "
      >
        <div>
          <label className="shadowed-box rounded-lg flex flex-col">
            <input
              type="email"
              name="email"
              value={validation.values.email}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              placeholder="Email address"
              className={inputClasses}
            />
          </label>
          {validation.touched.email && validation.errors.email ? (
            <h2 className="text-red-700 mt-1" type="invalid">
              {validation.errors.email}
            </h2>
          ) : null}
        </div>

        <div>
          <label className="relative shadowed-box rounded-lg flex flex-col">
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              value={validation.values.password}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              placeholder="Password"
              className={inputClasses}
            />
            <div
              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </div>
          </label>
          {validation.touched.password && validation.errors.password ? (
            <h2 className="text-red-700 mt-1" type="invalid">
              {validation.errors.password}
            </h2>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-[#00BF63]  text-white py-3 text-base rounded-xl  ${
            loading ? "opacity-50" : "opacity-100"
          }`}
        >
          {loading ? ". . ." : "Log In"}
        </button>
      </form>
      <Link to="/forgot-password" className="flex-1">
            
      <h3 className="text-[#6A6A6A] text-center text-base my-4 cursor-pointer">
        Forgot password?
      </h3>
          </Link>
      
      <div className="w-full border-[#505050] border-solid border" />
      <div className="my-2 ">
        <h3 className="text-[#00BF63] text-center ">Sign up</h3>
        <div className="mt-2 flex gap-4 max-md:flex-col">
          <Link to="/sign-up/student" className="flex-1">
            <button className="bg-[#515151] text-white py-4 rounded-xl w-full">
              As Student
            </button>
          </Link>
          <Link to="/sign-up/instructor" className="flex-1">
            {" "}
            <button className="bg-[#515151] text-white py-4 rounded-xl w-full">
              As Instructor
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
