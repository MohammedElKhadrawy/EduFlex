import {Outlet} from "react-router-dom";
import LogoTin from "../assets/logoTin.png";
import EduFlex from "../assets/EduFlex.png";
import logoLogin from "../assets/logoLogin.png";
import xLogo from "../assets/x_logo.png";
import arrowUp from "../assets/arrow_up.png";
import faceLogo from "../assets/Facebook_logo.png";
import instaLogo from "../assets/insta_logo.png";
import threeLines from "../assets/three_lines.png";
import user from "../assets/user.png";
import play from "../assets/play_green.png";
import React, { useState,useEffect } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import {getCookie,delay,swAlert} from "../helpers";
import editbtn from "../assets/edit.png";
import {useDropzone} from "react-dropzone";
import emailIcon from "../assets/email_icon.png";

if(getCookie('token')){
    const fetchUserData = async () => {
        try {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+getCookie('token'),
                }
            };
            const back_end_url=import.meta.env.VITE_BACK_END_URL;

            const response = await fetch(back_end_url+'/users/show-me',requestOptions)
            const result = await response.json();
            if(response.status===200){
                document.cookie="user="+JSON.stringify(result.user)+"; path=/";
            }
        } catch (error) {
            swAlert("global");
        }
    };
    fetchUserData();
}

const MainLayout = () => {
    const pathname = window.location.pathname;
    function topFunction() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }
    const [scrol, setScrol] = useState("hidden");
    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            setScrol("block");
        } else {
            setScrol("hidden");
        }
    }
    window.onscroll = function() {scrollFunction()};
    let [rightMenu,setRightMenu]=useState(false);
    function rightMenuToggle(){
        if(rightMenu){
            setRightMenu(false);
        }else{
            setRightMenu(true);
        }
    }
    const [showAccountModal, setShowAccountModal] = React.useState(false);
    const [showPasswordModal, setShowPasswordModal] = React.useState(false);
    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmNewPasswordVisible, setIsConfirmNewPasswordVisible] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = React.useState(false);
    const [showOtpModal, setShowOtpModal] = React.useState(false);
    const [editable, setEditable] = React.useState(false);
    const back_end_url=import.meta.env.VITE_BACK_END_URL;
    const back_end_domain=import.meta.env.VITE_BACK_END_DOMAIN;
    const [files,setFiles]=useState(null);

    function editProfile(){
        let disabled_elements=document.getElementsByClassName("disabled_element");
        let edit_btn=document.getElementById("edit-btn");
        let save_btn=document.getElementById("save-btn");
        for(let i=0;i<disabled_elements.length;i++){
            disabled_elements[i].disabled=false;
        }
        edit_btn.hidden=true;
        save_btn.hidden=false;
        setEditable(true);
    }
    function editProfileBack(){
        setShowPasswordModal(false);
        setShowAccountModal(true);
        setEditable(false);
        let disabled_elements=document.getElementsByClassName("disabled_element");
        let edit_btn=document.getElementById("edit-btn");
        let save_btn=document.getElementById("save-btn");
        for(let i=0;i<disabled_elements.length;i++){
            disabled_elements[i].disabled=true;
        }
        edit_btn.hidden=false;
        save_btn.hidden=true;
    }

    const [userData, setUserdata] = React.useState(null);
    const [auth,setAuth]=useState(false);
    const [userAccount,setUserAccount]=useState(null);

    useEffect(() => {
        if (getCookie('user')) {
            setAuth(true);
            setUserdata(JSON.parse(getCookie('user')));
        }
    }, []);

    function logout(){
        document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href="/";
    }
    const [dataLoaded, setDataLoaded] = useState(false);
    function showAccount(){
        const fetchUserDetails = async () => {
            try {
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+getCookie('token'),
                    }
                };

                const response = await fetch(back_end_url+'/users/'+userData.userId,requestOptions)
                const result = await response.json();
                if(response.status===200){
                    setUserAccount(result.user);
                    setDataLoaded(true);
                }
            } catch (error) {
                swAlert("global");
            }
        };
        fetchUserDetails();
        setTimeout(function (){
            setShowAccountModal(true);
        },500);
    }

    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            firstName: dataLoaded?userAccount.firstName:"",
            lastName: dataLoaded?userAccount.lastName:"",
            email: dataLoaded?userAccount.email:"",
            education: dataLoaded?userAccount.education:"",
            stage: dataLoaded?userAccount.stage:"",
            level: dataLoaded?userAccount.level:"",
            role: dataLoaded?userAccount.role:"",
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required("Please enter your first name"),
            lastName: Yup.string().required("Please enter your last name"),
            email: Yup.string()
                .email("Invalid email")
                .required("Please enter your Email")
        }),
        onSubmit: (values) => {
            if(values.stage===""){
                values.stage=null;
            }
            if(values.level===""){
                values.level=null;
            }
            const requestOptions = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+getCookie('token') },
                body: JSON.stringify(values)
            };
            const updateUser = async () => {
                try {
                    const response = await fetch(back_end_url+'/users/update-user', requestOptions);
                    const data = await response.json();
                    if(response.status ===422){
                        swAlert("error",data.message,data.data[0]);
                    }else if(response.status ===200){
                        swAlert("success",data.message);
                        await delay(5000);
                        window.location.reload();
                    }

                } catch (error) {
                    swAlert("global");
                }
            };
            updateUser();
        }
    });

    function openPasswordForm(){
        setShowAccountModal(false);
        setShowPasswordModal(true);
    }

    const validationPassword = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
        validationSchema: Yup.object({
            currentPassword: Yup.string()
                .required("Please provide your old Password")
                .min(5, "It must be at least 5 characters "),
            newPassword: Yup.string()
                .required("Please provide your new Password")
                .min(5, "It must be at least 5 characters "),
            confirmNewPassword: Yup.string()
                .required("Please confirm your new Password")
                .oneOf([Yup.ref("newPassword")], "Password mismatch"),
        }),
        onSubmit: (values) => {
            const requestOptions = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+getCookie('token') },
                body: JSON.stringify(values)
            };
            const updatePassword = async () => {
                try {
                    const response = await fetch(back_end_url+'/users/change-user-password', requestOptions);
                    const data = await response.json();
                    if(response.status ===422||response.status ===401){
                        swAlert("error",data.message,data.data[0]);
                    }else if(response.status ===200){
                        swAlert("success",data.message);
                    }
                } catch (error) {
                    swAlert("global");
                }
            };
            updatePassword();
            editProfileBack();
        }
    });

    function otpModal(){
        setShowPaymentModal(false);
        setShowOtpModal(true);
    }
    function otpBack(){
        setShowPaymentModal(true);
        setShowOtpModal(false);
    }

    const { open } = useDropzone({
        accept: "image/*", // You can change the accepted file types
        onDrop: (acceptedFiles) => {
            setFiles(acceptedFiles[0]);
        },
    });

    useEffect( ()=>{
        async function uploadImage(){
            if(files!==null){
                const data = new FormData();
                data.append('profilePicture',files);
                const requestOptions = {
                    method: 'PATCH',
                    headers: {'Authorization': 'Bearer '+getCookie('token'),},
                    body: data
                };
                try {
                    const response = await fetch(back_end_url + '/users/upload-profile-picture', requestOptions);
                    const data = await response.json();
                    if (response.status === 422) {
                        swAlert("error",data.message,data.data[0]);
                    } else if (response.status === 200||response.status === 201) {
                        swAlert("success",data.message);
                    }

                } catch (error) {
                    swAlert("global");
                }
            }
        }
        uploadImage();
    },[files])
    return (
    <div>
        { auth ?(
            <div className="bg-gray-200 w-full fixed flex z-50" id="header">
                <div className="flex w-[25%]">
                    <img src={back_end_domain+'/'+userData.profilePicture} className="w-[60px] my-6 ml-[30%]" crossOrigin="anonymous"/>
                    <div className="font-[700] text-[#263238] my-[40px] ml-[5px]">HI, {userData.name}</div>
                </div>
                <div className="w-[50%]">
                    <img src={logoLogin} className="w-[200px] h-[80px] m-auto mt-[12px]"/>
                </div>
                <div className="w-[25%]">
                    <img src={threeLines} className="w-[50px] h-[40px] ml-[60%] mt-[30px] cursor-pointer" onClick={rightMenuToggle}/>
                </div>
            </div>
        ):(
            <div className="bg-gray-200 w-full fixed flex z-50" id="header">
                <img src={LogoTin} className="md:w-[80px] md:h-[80px] w-[50px] h-[50px] md:ml-[50px] ml-[10px] md:my-2 my-4"/>
                <img src={EduFlex} className="md:w-[180px] md:h-[60px] w-[100px] h-[30px] ml-2 md:my-5 my-6"/>
                <ul className="lg:ml-[20%] md:ml-[12%]">
                    <li className="nav-li pt-[30px] sm:px-[15px] px-2 lg:text-[1.15vw] text-[12px]"><a href="/" className={(pathname==="/"?"nav-selected":"")}>STUDENT</a></li>
                    <li className="nav-li pt-[30px] sm:px-[15px] px-2 lg:text-[1.15vw] text-[12px]"><a href="/instructor" className={(pathname==="/instructor"?"nav-selected":"")}>INSTRUCTOR</a></li>
                </ul>
                <div className="absolute right-[5%]">
                    <a href="/login" className="bg-[#00BF63] text-white text-base md:py-1 sm:px-10 px-4 mt-2 rounded-xl w-full  opacity-100 block">Log In</a>
                    <a href={(pathname==="/instructor"?'/sign-up/instructor':'/sign-up/student')} className="bg-[#00BF63] text-white md:py-1 my-2 sm:px-10 px-4 text-base rounded-xl w-full  opacity-100 block">Sign Up</a>
                </div>
            </div>
        )}
        <Outlet />
        <div id="footer">
            <div className="bg-[#F5F5F5] grid grid-cols-3 py-5 gap-2">
                <div>
                    <p className="font-bold mx-[25%] sm:text-[1.7vw] text-[10px]">Follow us through</p>
                    <p className="mx-[25%] sm:mt-8 mt-4 sm:text-[1.2vw] text-[8px]">social media for the latest updates and to say connected</p>
                    <div className="w-[70%] mx-[30%] mt-8">
                        <img src={xLogo} className="w-[20%] max-w-[35px] inline cursor-pointer hover:opacity-50"/>
                        <img src={faceLogo} className="w-[22%] max-w-[35px] ml-[20px] inline cursor-pointer hover:opacity-50"/>
                        <img src={instaLogo} className="w-[22%] max-w-[35px] ml-[20px] inline cursor-pointer hover:opacity-50"/>
                    </div>
                </div>
                <div>
                    <p className="font-bold mx-[25%] sm:text-[1.7vw] text-[10px]">Contact us</p>
                    <div className="mx-[15%] sm:mt-8 mt-4 sm:text-[1.2vw] text-[8px]">
                        <a href="mailto:eduflexteam@outlook.com" className="">
                            <img src={emailIcon} className="w-[20%] max-w-[35px] mx-[30%] mt-8 cursor-pointer"/>
                            <p className="px-5">eduflexteam@outlook.com</p>
                        </a>
                    </div>

                </div>
                <div>
                    <img src={LogoTin} className="w-[50%] border-[#BABABA] min-w-[120px] border-l-2 pl-[50px]"/>
                </div>
            </div>
            <div className="bg-[#515151]">
                <p className="text-center text-white font-bold text-[22px] py-3">Made with love by teamwork eduflex &copy; 2024</p>
            </div>
        </div>
        <div className={`fixed right-[20px] bottom-[40px] bg-[#00BF63] px-4 py-3 rounded-full cursor-pointer ${scrol}`} onClick={topFunction}>
            <img src={arrowUp} className="w-[20px]"/>
        </div>
        {/*Right Menu*/}
        { auth ?(
                <div className={"right-[-30px] top-[0] h-screen w-[25%] bg-[#E5E5E6] z-[51] rounded-l-lg "+(rightMenu?'fixed':'hidden')}>
                    <img src={threeLines} className="w-[50px] h-[40px] ml-[50%] mt-[30px] cursor-pointer" onClick={rightMenuToggle}/>
                    <img src={LogoTin} className="w-[100px] mt-[20px] m-auto"/>
                    <div className="bg-[#D9D9D9] border-b-[1px] border-[#96A09B] mt-5 px-10 py-2 cursor-pointer text-[18px] font-[500]" onClick={() => showAccount()}>
                        <img src={user} className="inline w-[30px] mr-2"/>
                        My Account
                    </div>
                    <a href="/student/courses">
                        <div className="bg-[#D9D9D9] border-b-[1px] border-[#96A09B] px-10 py-2 cursor-pointer text-[18px] font-[500]">
                            <img src={play} className="inline w-[30px] mr-2"/>
                            My Courses
                        </div>
                    </a>
                    <div className="text-[#E31818] text-center cursor-pointer mt-[50px] font-[600] text-[20px]" onClick={logout}>
                        Logout
                    </div>
                </div>
            )
            :null
        }

        {showAccountModal ? (
            <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-auto mt-[200px] mb-4 mx-auto max-w-xl">
                        {/*content*/}
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/*body*/}
                            <form onSubmit={validation.handleSubmit}>
                                <div className="relative px-6 flex-auto">
                                    <img src={back_end_domain+userData.profilePicture} className="mt-4 w-[80px] h-[80px] m-auto" crossOrigin="anonymous"/>
                                    <div className="text-center bg-[#D9D9D9] border-b-[1px] absolute p-1 left-[55%] top-[60px] rounded-full border-[#888888] cursor-pointer" onClick={() => open()}>
                                        <img src={editbtn} className="w-[14px]"/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="font-[500]">First Name</label>
                                            <input className="bg-[#EEEEEE] w-full h-[40px] px-4 rounded-[10px] mb-2 disabled_element" name="firstName" placeholder="Mo***" value={validation.values.firstName} onChange={validation.handleChange} disabled/>
                                            {validation.touched.firstName && validation.errors.firstName ? (
                                                <h2 className="text-red-700 mt-1" type="invalid">
                                                    {validation.errors.firstName}
                                                </h2>
                                            ) : null}
                                        </div>
                                        <div>
                                            <label className="font-[500]">Last Name</label>
                                            <input className="bg-[#EEEEEE] w-full h-[40px] px-4 rounded-[10px] mb-2 disabled_element" name="lastName" placeholder="Al***" value={validation.values.lastName} onChange={validation.handleChange} disabled/>
                                            {validation.touched.lastName && validation.errors.lastName ? (
                                                <h2 className="text-red-700 mt-1" type="invalid">
                                                    {validation.errors.lastName}
                                                </h2>
                                            ) : null}
                                        </div>
                                    </div>
                                    <label className="font-[500]">email address</label>
                                    <input className="bg-[#EEEEEE] w-full h-[40px] px-4 rounded-[10px] disabled_element" name="email" placeholder="mo****@gmail.com" value={validation.values.email} onChange={validation.handleChange} disabled/>
                                    {validation.touched.email && validation.errors.email ? (
                                        <h2 className="text-red-700 mt-1" type="invalid">
                                            {validation.errors.email}
                                        </h2>
                                    ) : null}
                                    <br/>
                                    <label className="font-[500]">Password</label>
                                    <input className="bg-[#EEEEEE] w-full h-[40px] px-4 rounded-[10px] disabled_element" value="******" disabled/>
                                    <p className="text-[14px] text-[#50505080] underline cursor-pointer" onClick={openPasswordForm}>Change password</p>
                                    {userAccount.role==="Student"?(
                                        <>
                                        <label>Education: </label>
                                        <select className="w-full bg-[#EEEEEE] rounded-[10px] px-4 py-2 mt-2 disabled_element" name="education" disabled value={validation.values.education} onBlur={validation.handleBlur} onChange={validation.handleChange}>
                                            <option value="">Select one</option>
                                            <option value="General">General</option>
                                            <option value="Special">Special</option>
                                            <option value="Graduated">Graduated</option>
                                        </select>
                                        {validation.touched.education && validation.errors.education ? (
                                            <h2 className="text-red-700 mt-1" type="invalid">
                                                {validation.errors.education}
                                            </h2>
                                        ) : null}
                                        {validation.values.education === "General" || validation.values.education === "Special" ? (
                                            <>
                                            <label>Stage:</label>
                                            {editable?(
                                                <select className="w-full bg-[#EEEEEE] rounded-[10px] px-4 py-2 mt-2 disabled_element" name="stage" value={validation.values.stage} onChange={validation.handleChange}>
                                                    <option value="">Select one</option>
                                                    <option value="Primary stage">Primary stage</option>
                                                    <option value="Middle school">Middle school</option>
                                                    <option value="High school">High school</option>
                                                    <option value="University">University</option>
                                                </select>
                                                ):(
                                                <select className="w-full bg-[#EEEEEE] rounded-[10px] px-4 py-2 mt-2 disabled_element" name="stage" disabled value={validation.values.stage} onChange={validation.handleChange}>
                                                    <option value="">Select one</option>
                                                    <option value="Primary stage">Primary stage</option>
                                                    <option value="Middle school">Middle school</option>
                                                    <option value="High school">High school</option>
                                                    <option value="University">University</option>
                                                </select>
                                            )}
                                            {validation.touched.stage && validation.errors.stage ? (
                                                <h2 className="text-red-700 mt-1" type="invalid">
                                                    {validation.errors.stage}
                                                </h2>
                                            ) : null}
                                            {validation.values.stage !== "University" ? (
                                                <>
                                                <label>Level: </label>
                                                    {editable?(
                                                        <select className="w-full bg-[#EEEEEE] rounded-[10px] px-4 py-2 mt-2 disabled_element" name="level" value={validation.values.level} onChange={validation.handleChange}>
                                                            <option value="">Select one</option>
                                                            <option value="Level one">Level One</option>
                                                            <option value="Level two">Level Two</option>
                                                            <option value="Level three">Level Three</option>
                                                        </select>
                                                    ):(
                                                        <select className="w-full bg-[#EEEEEE] rounded-[10px] px-4 py-2 mt-2 disabled_element" disabled name="level" value={validation.values.level} onChange={validation.handleChange}>
                                                            <option value="">Select one</option>
                                                            <option value="Level one">Level One</option>
                                                            <option value="Level two">Level Two</option>
                                                            <option value="Level three">Level Three</option>
                                                        </select>
                                                    )}
                                                {validation.touched.level && validation.errors.level ? (
                                                    <h2 className="text-red-700 mt-1" type="invalid">
                                                        {validation.errors.level}
                                                    </h2>
                                                ) : null}
                                                </>
                                                ) : null}
                                            </>
                                            ) : null}
                                        </>
                                        ):null}
                                        <div className="cursor-pointer bg-[#EEEEEE] py-2 text-[#505050] text-center w-[150px] mt-4 rounded-[10px] font-bold text-[18px] underline" onClick={()=>setShowPaymentModal(true)}>
                                            + Add Card
                                        </div>
                                    </div>
                                <div className="p-6 rounded-b" id="edit-btn">
                                    <div className="cursor-pointer bg-[#00BF63] py-2 text-white text-center w-[100%] my-4 rounded-[10px] font-bold text-[20px]" onClick={()=>editProfile()}>
                                        Edit
                                    </div>
                                    <div className="cursor-pointer bg-[#C1C1C1] py-2 text-white text-center w-[100%] my-4 rounded-[10px] font-bold text-[20px]" onClick={()=>setShowAccountModal(false)}>
                                        Cancel
                                    </div>
                                </div>
                                <div className="p-6 rounded-b" id="save-btn" hidden>
                                    <button className="cursor-pointer bg-[#00BF63] py-2 text-white text-center w-[100%] my-4 rounded-[10px] font-bold text-[20px]" type="submit">
                                        Save
                                    </button>
                                    <div className="cursor-pointer bg-[#F76060] py-2 text-white text-center w-[100%] my-4 rounded-[10px] font-bold text-[20px]" onClick={()=>editProfileBack()}>
                                        Revert
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="opacity-75 fixed inset-0 z-40 bg-[#a3a3a39c]"></div>
            </>
        ) : null}
        {showPasswordModal ? (
            <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-auto mt-[100px] mb-4 mx-auto max-w-xl">
                        {/*content*/}
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/*body*/}
                            <form onSubmit={validationPassword.handleSubmit}>
                                <div className="relative px-6 flex-auto">
                                    <img src={back_end_domain+userData.profilePicture} className="mt-4 w-[80px] m-auto"/>
                                    <label className="font-[500]">Current Password</label>
                                    <input className="bg-[#EEEEEE] w-full h-[40px] px-4 rounded-[10px] disabled_element" name="currentPassword" value={validationPassword.values.currentPassword} onChange={validationPassword.handleChange} type={isCurrentPasswordVisible ? "text" : "password"}/>
                                    <div className="absolute top-[115px] right-5 flex items-center px-4 text-gray-600 cursor-pointer" onClick={() => {setIsCurrentPasswordVisible((prevState) => !prevState);}}>
                                        {isCurrentPasswordVisible ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            </svg>
                                        )}
                                    </div>
                                    {validationPassword.touched.currentPassword && validationPassword.errors.currentPassword ? (
                                        <h2 className="text-red-700 mt-1" type="invalid">
                                            {validationPassword.errors.currentPassword}
                                        </h2>
                                    ) : null}
                                    <br/>
                                    <label className="font-[500]">New Password</label>
                                    <input className="bg-[#EEEEEE] w-full h-[40px] px-4 rounded-[10px] disabled_element" name="newPassword" value={validationPassword.values.newPassword} onChange={validationPassword.handleChange} type={isNewPasswordVisible ? "text" : "password"}/>
                                    <div className="absolute top-[175px] right-5 flex items-center px-4 text-gray-600 cursor-pointer" onClick={() => {setIsNewPasswordVisible((prevState) => !prevState);}}>
                                        {isNewPasswordVisible ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            </svg>
                                        )}
                                    </div>
                                    {validationPassword.touched.newPassword && validationPassword.errors.newPassword ? (
                                        <h2 className="text-red-700 mt-1" type="invalid">
                                            {validationPassword.errors.newPassword}
                                        </h2>
                                    ) : null}
                                    <br/>
                                    <label className="font-[500]">Confirm New Password</label>
                                    <input className="bg-[#EEEEEE] w-full h-[40px] px-4 rounded-[10px] disabled_element" name="confirmNewPassword" value={validationPassword.values.confirmNewPassword} onChange={validationPassword.handleChange} type={isConfirmNewPasswordVisible ? "text" : "password"}/>
                                    <div className="absolute top-[245px] right-5 flex items-center px-4 text-gray-600 cursor-pointer" onClick={() => {setIsConfirmNewPasswordVisible((prevState) => !prevState);}}>
                                        {isConfirmNewPasswordVisible ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                            </svg>
                                        )}
                                    </div>
                                    {validationPassword.touched.confirmNewPassword && validationPassword.errors.confirmNewPassword ? (
                                        <h2 className="text-red-700 mt-1" type="invalid">
                                            {validationPassword.errors.confirmNewPassword}
                                        </h2>
                                    ) : null}
                                    <br/>
                                </div>
                                <div className="p-6 rounded-b" id="save-btn">
                                    <button className="cursor-pointer bg-[#00BF63] py-2 text-white text-center w-[100%] my-4 rounded-[10px] font-bold text-[20px]" type="submit">
                                        Save
                                    </button>
                                    <div className="cursor-pointer bg-[#F76060] py-2 text-white text-center w-[100%] my-4 rounded-[10px] font-bold text-[20px]" onClick={()=>editProfileBack()}>
                                        Revert
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="opacity-75 fixed inset-0 z-40 bg-[#a3a3a39c]"></div>
            </>
        ) : null}

        {showPaymentModal ? (
            <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-auto mt-[100px] mb-4 mx-auto max-w-xl">
                        {/*content*/}
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/*header*/}
                            <div className="p-5">
                                <button className="p-1 ml-auto bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none" onClick={() => setShowPaymentModal(false)}>
                                    <img src="../src/assets/arrow_left.png" className="w-[30px]"/>
                                </button>
                            </div>
                            {/*body*/}
                            <div className="relative px-6 flex-auto">
                                <p>with</p>
                                <img src="../src/assets/payments.PNG" className="w-[80%] mt-2"/>
                                <label className="font-[500]">Card Name</label>
                                <input className="bg-[#EEEEEE] w-full h-[40px] px-4 rounded-[10px] mb-2" placeholder="Ali m*****"/>
                                <br/>
                                <label className="font-[500]">Card Number</label>
                                <input className="bg-[#EEEEEE] w-full h-[40px] px-4 rounded-[10px]" placeholder="6090xxxx"/>
                                <br/>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="font-[500]">Expire</label>
                                        <input className="bg-[#EEEEEE] w-full h-[40px] px-4 rounded-[10px] mb-2" placeholder="03/26"/>
                                    </div>
                                    <div>
                                        <label className="font-[500]">CVV</label>
                                        <input className="bg-[#EEEEEE] w-full h-[40px] px-4 rounded-[10px] mb-2" placeholder="398"/>
                                    </div>
                                </div>
                                <label className="container">Set as primary card
                                    <input type="checkbox"/>
                                    <span className="checkmark"></span>
                                </label>
                            </div>
                            <div className="p-6 rounded-b">
                                <div className="cursor-pointer bg-[#00BF63] py-2 text-white text-center w-[100%] my-4 rounded-[10px] font-bold text-[20px]" onClick={() => otpModal()}>
                                    Add Card
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="opacity-75 fixed inset-0 z-40 bg-[#a3a3a39c]"></div>
            </>
        ) : null}
        {showOtpModal ? (
            <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-auto mt-[100px] mb-4 mx-auto max-w-xl">
                        {/*content*/}
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/*header*/}
                            <div className="p-5">
                                <button className="p-1 ml-auto bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none" onClick={() => otpBack()}>
                                    <img src="../src/assets/arrow_left.png" className="w-[30px]"/>
                                </button>
                            </div>
                            {/*body*/}
                            <div className="relative px-6 flex-auto">
                                <p className="text-center text-[#515151] font-bold text-[20px] mb-8">OTP</p>
                                <p className="text-center text-[#515151] font-[400] text-[14px] mx-8 mb-4">The code send to your phone **********73</p>
                                <input className="bg-[#EEEEEE] w-[50px] h-[40px] px-4 rounded-[10px] mb-2 mr-2 border-[1px] border-[#C1C1C1]"/>
                                <input className="bg-[#EEEEEE] w-[50px] h-[40px] px-4 rounded-[10px] mb-2 mr-2 border-[1px] border-[#C1C1C1]"/>
                                <input className="bg-[#EEEEEE] w-[50px] h-[40px] px-4 rounded-[10px] mb-2 mr-2 border-[1px] border-[#C1C1C1]"/>
                                <input className="bg-[#EEEEEE] w-[50px] h-[40px] px-4 rounded-[10px] mb-2 mr-2 border-[1px] border-[#C1C1C1]"/>
                                <input className="bg-[#EEEEEE] w-[50px] h-[40px] px-4 rounded-[10px] mb-2 mr-2 border-[1px] border-[#C1C1C1]"/>
                                <input className="bg-[#EEEEEE] w-[50px] h-[40px] px-4 rounded-[10px] mb-2 border-[1px] border-[#C1C1C1]"/>
                                <p className="text-[#919191] font-[400] text-[14px] mx-8 my-4 relative">
                                    Resend in 01:00
                                    <span className="absolute font-[500] cursor-pointer right-0">Resend?</span>
                                </p>
                            </div>
                            <div className="p-6 rounded-b">
                                <div className="cursor-pointer bg-[#00BF63] py-2 text-white text-center w-[100%] my-4 rounded-[10px] font-bold text-[20px]" onClick={() => setShowOtpModal(false)}>
                                    Verify
                                </div>
                                <div className="cursor-pointer bg-[#959595] py-2 text-white text-center w-[100%] my-4 rounded-[10px] font-bold text-[20px]" onClick={() => setShowOtpModal(false)}>
                                    Cancel
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="opacity-75 fixed inset-0 z-40 bg-[#a3a3a39c]"></div>
            </>
        ) : null}
    </div>
  );
};

export default MainLayout;