import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import backImage from '../../assets/back.png';
import {delay,swAlert} from "../../helpers";

const SignUpStudentForm = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [showStage, setShowStage] = useState(false);
  const [showLevel, setShowLevel] = useState(false);

  const inputClasses =
    "bg-[#EDEDEDED] py-4 px-6 placeholder:text-[#C1C1C1]  font-sans font-normal resize-none text-#C1C1C1 opacity-90 rounded-lg outline-none border-none font-medium";

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      education: "",
      stage: "",
      level: "",
      role: "Student",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please enter your first name"),
      lastName: Yup.string().required("Please enter your last name"),
      email: Yup.string()
        .email("Invalid email")
        .required("Please enter your Email"),
      password: Yup.string()
        .required("Please provide your Password")
        .min(5, "It must be at least 5 characters "),
      confirmPassword: Yup.string()
        .required("Please confirm your Password")
        .oneOf([Yup.ref("password")], "Password mismatch"),
      education: Yup.string().required("Please enter your education"),

    }),
    onSubmit: (values) => {
      const data = new FormData();
      if(values.stage!==""){
        data.append('stage', values.stage);
      }
      if(values.level!==""){
        data.append('level', values.level);
      }
      data.append('firstName',values.firstName);
      data.append('lastName',values.lastName);
      data.append('email',values.email);
      data.append('password',values.password);
      data.append('confirmPassword',values.confirmPassword);
      data.append('education',values.education);
      data.append('role',values.role);
      const requestOptions = {
        method: 'POST',
        body: data,
      };
      const back_end_url=import.meta.env.VITE_BACK_END_URL;
      const registerUser = async () => {
        try {
          const response = await fetch(back_end_url+'/auth/register', requestOptions);
          const data = await response.json();
          if(response.status ===422){
            swAlert("error",data.message,data.data[0]);
          }else if(response.status ===201){
            swAlert("success",data.message+" .. you will be redirect to verification in 5 seconds");
            await delay(5000);
            localStorage.setItem("email", values.email);
            localStorage.setItem("resetPassword", "no");
            navigate("/verification");
          }

        } catch (error) {
          swAlert("global");
        }
      };
      registerUser();
    },
  });

  return (
    <div className="  max-w-[500px] mx-auto">
      <button onClick={() => navigate(-1)} className="fixed top-[100px] left-[120px]">
        <img src={backImage} alt="Back" className="h-8 w-8"/>
      </button>
      <div className="absolute top-100px left-70px"></div>
      <h1 className="font-bold text-[#515151] text-4xl text-center"> SIGN UP </h1>
      <form
        onSubmit={validation.handleSubmit}
        className=" flex flex-col gap-4 mt-9 "
      >
        <div className="flex gap-4 max-sm:flex-col">
          <div className="flex-1">
            <label className="shadowed-box rounded-lg flex flex-col">
              <input
                type="text"
                name="firstName"
                value={validation.values.firstName}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                placeholder="First name"
                className={inputClasses}
              />
            </label>
            {validation.touched.firstName && validation.errors.firstName ? (
              <h2 className="text-red-700 mt-1" type="invalid">
                {validation.errors.firstName}
              </h2>
            ) : null}
          </div>
          <div className="flex-1">
            <label className="shadowed-box rounded-lg flex flex-col">
              <input
                type="text"
                name="lastName"
                value={validation.values.lastName}
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                placeholder="Last Name"
                className={inputClasses}
              />
            </label>
            {validation.touched.lastName && validation.errors.lastName ? (
              <h2 className="text-red-700 mt-1" type="invalid">
                {validation.errors.lastName}
              </h2>
            ) : null}
          </div>
        </div>
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
              onClick={() => {
                setIsPasswordVisible((prevState) => !prevState);
              }}
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
        <div>
          <label className="relative shadowed-box rounded-lg flex flex-col">
            <input
              type={isConfirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              value={validation.values.confirmPassword}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              placeholder="Confirm password"
              className={inputClasses}
            />
            <div
              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 cursor-pointer"
              onClick={() => {
                setIsConfirmPasswordVisible((prevState) => !prevState);
              }}
            >
              {isConfirmPasswordVisible ? (
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
          {validation.touched.confirmPassword &&
          validation.errors.confirmPassword ? (
            <h2 className="text-red-700 mt-1" type="invalid">
              {validation.errors.confirmPassword}
            </h2>
          ) : null}
        </div>
        <div>
          <select
            name="education"
            className={` ${inputClasses} w-full`}
            value={validation.values.education}
            onChange={validation.handleChange}
          >
            <option value="" disabled hidden>
              Education
            </option>
            <option value="General">General</option>
            <option value="Special">Special</option>
            <option value="Graduated">Graduated</option>
          </select>
          {validation.touched.education && validation.errors.education ? (
            <h2 className="text-red-700 mt-1" type="invalid">
              {validation.errors.education}
            </h2>
          ) : null}
        </div>
        {validation.values.education === "General" || validation.values.education === "Special" ? (
          <>
            <div>
              <select
                name="stage"
                className={` ${inputClasses} w-full`}
                value={validation.values.stage}
                onChange={validation.handleChange}
              >
                <option value="" disabled hidden>
                  Stage
                </option>
                <option value="Primary stage">Primary stage</option>
                <option value="Middle school">Middle school</option>
                <option value="High school">High school</option>
                <option value="University">University</option>
              </select>
              {validation.touched.stage && validation.errors.stage ? (
                <h2 className="text-red-700 mt-1" type="invalid">
                  {validation.errors.stage}
                </h2>
              ) : null}
            </div>
            {validation.values.stage !== "University" ? (
              <div>
                <select
                  name="level"
                  className={` ${inputClasses} w-full`}
                  value={validation.values.level}
                  onChange={validation.handleChange}
                >
                  <option value="" disabled hidden>
                    Level
                  </option>
                  <option value="Level one">Level One</option>
                  <option value="Level two">Level Two</option>
                  <option value="Level three">Level Three</option>
                </select>
                {validation.touched.level && validation.errors.level ? (
                  <h2 className="text-red-700 mt-1" type="invalid">
                    {validation.errors.level}
                  </h2>
                ) : null}
              </div>
            ) : null}{" "}
          </>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className={`bg-[#00BF63]  text-white py-3 text-base rounded-xl w-full  ${
            loading ? "opacity-50" : "opacity-100"
          }`}
        >
          {loading ? ". . ." : "Create account"}
        </button>
      </form>
    </div>
  );
};

export default SignUpStudentForm;
