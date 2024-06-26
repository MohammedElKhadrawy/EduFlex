import React, {useEffect, useState} from "react";
import {getCookie, swAlert} from "../../helpers.jsx";

const StudentCourses = () => {
    const [showPaymentModal, setShowPaymentModal] = React.useState(false);
    const [showOtpModal, setShowOtpModal] = React.useState(false);
    const [course,setCourse]=useState([]);
    const [dataLoaded,setDataLoaded]=useState(false);
    const back_end_url=import.meta.env.VITE_BACK_END_URL;
    const back_end_domain=import.meta.env.VITE_BACK_END_DOMAIN;

    useEffect(()=>{
        if(!getCookie('token')){
            window.location.href="/";
        }
        const getCourse = async () => {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+getCookie('token') },
            };
            try {
                const queryParams = new URLSearchParams(window.location.search);
                const response = await fetch(back_end_url+'/courses/'+queryParams.get("id"), requestOptions);
                const data = await response.json();
                if(response.status ===422){
                    swAlert("error",data.message,data.data[0]);
                }else if(response.status ===201){
                    swAlert("success",data.message);
                }else if(response.status ===200){
                    setCourse(data.course);
                    setDataLoaded(true);
                }

            } catch (error) {
                swAlert("global");
            }
        };
        getCourse();
    },[]);
    function otpModal(){
        setShowPaymentModal(false);
        setShowOtpModal(true);
    }
    function otpBack(){
        setShowPaymentModal(true);
        setShowOtpModal(false);
    }
    async function enroll() {
        setShowOtpModal(false);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+getCookie('token') },
        };
        try {
            const queryParams = new URLSearchParams(window.location.search);
            const response = await fetch(back_end_url+'/courses/'+queryParams.get("id")+'/enroll', requestOptions);
            const data = await response.json();
            if(response.status ===422||response.status===400){
                swAlert("error",data.message);
            }else if(response.status ===201||response.status===200){
                swAlert("success",data.message);
            }

        } catch (error) {
            swAlert("error","you are already enrolled in this course!");
        }
    }
    return (
        <div className="pt-[100px]">
            <div className="mx-[20%] grid grid-cols-2">
                <div>
                    <div className="bg-[#D9D9D9] w-[100%] aspect-video m-auto mt-[20px] pt-[15%]">
                        <img src="../../src/assets/play.png" className="w-[25%] m-auto"/>
                    </div>
                    <div className="my-4 py-1 bg-[#F4F4F4]">
                        <div className="cursor-pointer bg-[#00BF63] py-2 text-white text-center w-[30%] my-4 m-auto rounded-[10px] font-bold text-[1.2vw]" onClick={() => setShowPaymentModal(true)}>
                            Buy now
                        </div>
                    </div>

                    {dataLoaded?course.reviews.map((rev,i)=>(
                        <div className="mb-[20px] flex" key={i}>
                            <div className="w-[70px] bg-[#D9D9D9] aspect-square rounded-full">
                                <img src={back_end_domain+rev.user.profilePicture}/>
                            </div>
                            <div className="bg-[#D9D9D9] w-[80%] ml-[6%] rounded-[10px]">
                                <p className="text-[#777777] px-[20px] pt-2 font-[600]">{rev.user.firstName+' '+rev.user.lastName}</p>
                                <p className="text-black px-[40px] font-[600]">{rev.comment}</p>
                            </div>
                        </div>
                    )):null}
                    {dataLoaded?course.reviews.length===0?(
                        <div className="text-[1.4vw] text-center font-[700] my-4">
                            No Comments yet ..
                        </div>
                    ):null:null}


                </div>
                <div className="ml-2 mt-[20px]">
                    <div className="bg-[#F4F4F4] rounded-[5px] px-4 py-4">
                        <p className="font-bold">NAME OF COURSE: {course.title}</p>
                        <img src="../../src/assets/star_f.PNG" className="inline w-[20px]"/>
                        <img src="../../src/assets/star_f.PNG" className="inline w-[20px]"/>
                        <img src="../../src/assets/star_f.PNG" className="inline w-[20px]"/>
                        <img src="../../src/assets/star_f.PNG" className="inline w-[20px]"/>
                        <img src="../../src/assets/star.PNG" className="inline w-[20px]"/>
                        <p className="mt-2">{course.description}</p>
                        <p className="font-[500]">Education: {course.education}</p>
                        <p className="font-[500]">Stage: {course.stage}</p>
                        <p className="font-[500]">Level: {course.level}</p>
                        <p className="font-[500]">Term: {course.term}</p>
                        <p className="font-[500]">Subject: {course.subject}</p>
                        <p className="font-[500]">Course availability: {course.courseAvailability}</p>
                        <p className="font-[500]">Language: {course.language}</p>
                        <p className="font-[500]">Price: {course.price}</p>
                    </div>
                </div>
            </div>
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
                                        Buy now
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
                                    <div className="cursor-pointer bg-[#00BF63] py-2 text-white text-center w-[100%] my-4 rounded-[10px] font-bold text-[20px]" onClick={() => enroll()}>
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

export default StudentCourses;
