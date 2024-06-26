import React, {useEffect, useState} from "react";
import {getCookie, swAlert} from "../../helpers.jsx";

const StudentCourseView = () => {
    const [courses,setCourses]=useState([]);
    const [dataLoaded,setDataLoaded]=useState(false);
    const back_end_url=import.meta.env.VITE_BACK_END_URL;
    const back_end_domain=import.meta.env.VITE_BACK_END_DOMAIN;

    useEffect(()=>{
        if(!getCookie('token')){
            window.location.href="/";
        }
        const getCourses = async () => {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+getCookie('token') },
            };
            try {
                const response = await fetch(back_end_url+'/courses/user-courses', requestOptions);
                const data = await response.json();
                if(response.status ===422){
                    swAlert("error",data.message,data.data[0]);
                }else if(response.status ===201){
                    swAlert("success",data.message);
                }else if(response.status ===200){
                    setCourses(data.courses);
                    setDataLoaded(true);
                }

            } catch (error) {
                swAlert("global");
            }
        };
        getCourses();
    },[]);
    return (
        <div className="pt-[120px] min-h-[600px]">
           <h2 className="text-center font-[700] text-[#05C066] text-[1.8vw]">My courses</h2>
            <div>
                <div className="mx-[5%] my-8 grid grid-cols-5 gap-8">
                    {courses.map((course,i)=>(
                        course.status!=="Rejected"?(
                                <span key={i}>
                                   <a href={"/student/course/view?id="+course._id}>
                                       <img src={back_end_domain+course.imageUrl} crossOrigin="anonymous"/>
                                   </a>
                               </span>
                            ):null
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentCourseView;
