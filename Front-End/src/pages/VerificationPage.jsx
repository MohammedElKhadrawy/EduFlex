import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import VerificationInput from "react-verification-input";
import backImage from '../assets/back.png';
import {useFormik} from "formik";

const VerificationPage = () => {
    const [timer, setTimer] = useState(60);
    const [timerReset, setTimerReset] = useState(false);
    const [code, setCode] = useState("");
    const navigate = useNavigate();
    const back_end_url=import.meta.env.VITE_BACK_END_URL;
    var originalEmail = localStorage.getItem("email");
    var resetPassword = localStorage.getItem("resetPassword")??"no";
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev > 1) return prev - 1;
                clearInterval(interval);
                setTimerReset(true);
                return 0;
            });
        }, 1000);

        // cleanup
        return () => clearInterval(interval);
    }, [timerReset]);

    function resendCode() {
        if (timerReset) {
            setTimer(60);
            setTimerReset(false);
        }
        const resendCode = async () => {
            try {
                const values = {email: originalEmail};
                const requestOptions = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(values)
                };
                const response = await fetch(back_end_url + '/auth/resend-otp', requestOptions);
                const data = await response.json();
                if (response.status === 422) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops: " + data.message + " ...",
                        text: data.data[0],
                    });
                }

            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops: Server error ...",
                    text: "Internal server error 500",
                });
                console.error('Error:', error);
            }
        }
        resendCode();
    }

    function maskEmail(email) {
        // Split the email address into local part and domain
        var [localPart, domain] = email.split("@");
        // Mask part of the local part
        var maskedLocalPart =
            localPart.substring(0, 5) + "*".repeat(localPart.length - 5);
        // Concatenate the masked local part and the domain
        var maskedEmail = maskedLocalPart + "@" + domain;
        return maskedEmail;
    }
    let initValues;
    let endPoint;
    if (resetPassword==="yes") {
        initValues={
            email: originalEmail,
            resetPwOtp: code,
            newPassword: "",
            confirmNewPassword: "",
        };
        endPoint="/auth/reset-password";
    } else {
        initValues={
            email: originalEmail,
            otp: code,
        };
        endPoint="/auth/verify-email";
    }
    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,
        initialValues: initValues,
        onSubmit: (values) => {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            };
            const verifyUser = async () => {
                try {
                    const response = await fetch(back_end_url+endPoint, requestOptions);
                    const data = await response.json();
                    if(response.status ===422||response.status ===400){
                        Swal.fire({
                            icon: "error",
                            title: "Oops: "+data.message+" ...",
                            text: data.data[0],
                        });
                    }else if(response.status ===200){
                        document.cookie="token="+data.token+"; path=/";
                        navigate("/login");
                    }

                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops ...",
                        text: "Invalid OTP or OTP expired",
                    });
                    console.error('Error:', error);
                }
            };
            verifyUser();
        },
    });

    return (
        <div className=" pt-24 max-w-[500px] mx-auto">
            <form onSubmit={validation.handleSubmit}>
                <button onClick={() => navigate("/forgot-password")} className="absolute top-[100px] left-[120px]">
                    <img src={backImage} alt="Back" className="h-8 w-8"/>
                </button>
                <div className="absolute top-100px left-70px"></div>
                <h1 className="font-bold text-4xl text-center mb-6">
                    Verification Code{" "}
                </h1>
                <h2 className="text-center text-[#6A6A6A] mb-8 ">
                    {" "}
                    The code send to your{" "}
                    {maskEmail(originalEmail)}{" "}
                </h2>
                <VerificationInput name="otp" placeholder="" autoFocus validChars="0-9" inputProps={{inputMode: "numeric"}} length={6} classNames={{container: "mx-auto", character: "character", characterInactive: "character--inactive", characterSelected: "character--selected",}} onChange={(e) => {setCode(e);}}/>
                <h2 onClick={resendCode} className={`${timerReset ? "text-[#00BF63] cursor-pointer" : "text-[#6A6A6A]"} my-8 text-center`}>
                    {timerReset ? "Resend " : "Resend in "} {!!timer && timer}
                </h2>
                {resetPassword==="yes"?(
                    <>
                        <label className="shadowed-box rounded-lg flex flex-col">
                            <input type="password" name="newPassword" value={validation.values.newPassword} onChange={validation.handleChange} onBlur={validation.handleBlur} placeholder="New Password" className="bg-[#EEEEEE] w-[80%] h-[40px] px-4 rounded-[10px] m-auto"/>
                        </label>
                        <label className="shadowed-box rounded-lg flex flex-col">
                            <input type="password" name="confirmNewPassword" value={validation.values.confirmNewPassword} onChange={validation.handleChange} onBlur={validation.handleBlur} placeholder="Confirm New Password" className="bg-[#EEEEEE] w-[80%] h-[40px] px-4 rounded-[10px] m-auto my-3"/>
                        </label>
                    </>
                ):null}
                <button type="submit" disabled={code.length !== 6} className={`bg-[#00BF63]  text-white py-3 text-base rounded-xl w-full  ${code.length !== 6 ? "opacity-50" : "opacity-100"}`}>
                    Verify
                </button>
            </form>
        </div>
    );
};

export default VerificationPage;
