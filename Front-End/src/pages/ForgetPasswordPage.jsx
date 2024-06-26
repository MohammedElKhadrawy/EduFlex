import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import backImage from '../assets/back.png';

const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
);

const ForgetPasswordPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const inputClasses =
    "bg-[#EDEDEDED] py-4 px-6 placeholder:text-[#C1C1C1]  font-sans font-normal resize-none text-#C1C1C1 opacity-90 rounded-lg outline-none border-none font-medium";

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email")
        .required("Please enter your Email"),
    }),
    onSubmit: (values) => {
      setLoading(true);
      localStorage.setItem("email", values.email);
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      };
      const back_end_url=import.meta.env.VITE_BACK_END_URL;
      const restorePassword = async () => {
        try {
          const response = await fetch(back_end_url+'/auth/forgot-password', requestOptions);
          const data = await response.json();
          if(response.status ===422||response.status ===404){
            Swal.fire({
              icon: "error",
              title: "Oops: "+data.message+" ...",
              text: data.data[0],
            });
          }else if(response.status ===200){
            Swal.fire({
              icon: "success",
              title: "Great ...",
              text: data.message+" .. you will be redirect to verification in 5 seconds",
            });
            await delay(5000);
            localStorage.setItem("email", values.email);
            localStorage.setItem("resetPassword", "yes");
            navigate("/verification");
          }

        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops: Server error ...",
            text: "User not found",
          });
          console.error('Error:', error);
        }
      };
      restorePassword();
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    },
  });
  return (
    <div className=" pt-24 max-w-[500px] mx-auto">
      <button onClick={() => navigate("/")} className="absolute top-[100px] left-[120px]">
        <img src={backImage} alt="Back" className="h-8 w-8"/>
      </button>
      <div className="absolute top-100px left-70px"></div>
      <h1 className="font-bold text-4xl text-center mb-6">Forgot Password?</h1>
      <h2 className="text-center text-[#6A6A6A] mb-8 ">
        Enter email associated with your account and we’ll send and email with
        intructions to reset password
      </h2>
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

        <button
          type="submit"
          className={`bg-[#00BF63]  text-white py-3 text-base rounded-xl w-full  `}
        >
          Send code
        </button>
      </form>
    </div>
  );
};

export default ForgetPasswordPage;
