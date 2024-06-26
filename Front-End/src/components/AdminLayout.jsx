import {json, Outlet} from "react-router-dom";
import LogoTin from "../assets/logoTin.png";
import links from "../assets/admin_icons/links.png";
import students from "../assets/admin_icons/student.png";
import instructors from "../assets/admin_icons/instructor.png";
import courses from "../assets/admin_icons/courses.png";
import React, {useEffect, useState} from 'react';
import {getCookie,delay,swAlert} from "../helpers";

const MainLayout = () => {
    const currentStat=sessionStorage.getItem('stat')??"full";
    const [stat, setStat] = useState(currentStat);
    function toggleNav() {
        let nav_icon=document.getElementById("full");
        let nav_icon_half=document.getElementById("half");
        if(stat==="full"){
            sessionStorage.setItem('stat', 'half');
            setStat("half");
            nav_icon.style.display="none";
            nav_icon_half.style.display="block";
        }else{
            sessionStorage.setItem('stat', 'full');
            setStat("full");
            nav_icon.style.display="block";
            nav_icon_half.style.display="none";
        }
    }
    const pathname = window.location.pathname;
    useEffect(()=>{
        if(getCookie('token')&&JSON.parse(getCookie('user')).role==="Admin"){
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
        }else{
            window.location.href="/";
        }
    },[]);
    return (
    <div>
        <div className="flex">
            <div className={"relative bg-gradient-to-b h-lvh min-h-screen from-[#3E554AFB] via-[#00BF63] to-[#4A525B] "+(stat==="full"?"w-[15%]":"lg:w-[5%] w-[10%]")}>
                <div className={"absolute right-[8%] top-[20px] text-white cursor-pointer "+(currentStat==="full"?"":"hidden")} id="full" onClick={toggleNav}>❮❮</div>
                <div className={"absolute right-[8%] top-[20px] text-white cursor-pointer "+(currentStat==="full"?"hidden":"")} id="half" onClick={toggleNav}>❯❯</div>
                <img src={LogoTin} className="w-[60%] m-auto mt-[80px]"/>
                <div className={"cursor-pointer mt-[50px] mx-2 p-2 "+(pathname==="/admin/requests"?"admin-nav-selected":"")}>
                    <a href="/admin/requests">
                        <img src={links} className={"inline "+(stat==="full"?"w-[12%] ml-[10%]":"w-[80%] ml-[10%]")}/>
                        <span className={"text-white text-[1.5vw] pl-4 "+(stat==="full"?"":"hidden")}>Requests</span>
                    </a>
                </div>
                <div className={"cursor-pointer mt-3 mx-2 p-2 "+(pathname==="/admin/students"?"admin-nav-selected":"")}>
                    <a href="/admin/students">
                        <img src={students} className={"inline "+(stat==="full"?"w-[12%] ml-[10%]":"w-[80%] ml-[10%]")}/>
                        <span className={"text-white text-[1.5vw] pl-4 "+(stat==="full"?"":"hidden")}>Students</span>
                    </a>
                </div>
                <div className={"cursor-pointer mt-3 mx-2 p-2 "+(pathname==="/admin/instructors"?"admin-nav-selected":"")}>
                    <a href="/admin/instructors">
                        <img src={instructors} className={"inline "+(stat==="full"?"w-[12%] ml-[10%]":"w-[80%] ml-[10%]")}/>
                        <span className={"text-white text-[1.5vw] pl-4 "+(stat==="full"?"":"hidden")}>Instructor</span>
                    </a>
                </div>
                <div className={"cursor-pointer mt-3 mx-2 p-2 "+(pathname==="/admin/courses"?"admin-nav-selected":"")}>
                    <a href="/admin/courses">
                        <img src={courses} className={"inline "+(stat==="full"?"w-[12%] ml-[10%]":"w-[80%] ml-[10%]")}/>
                        <span className={"text-white text-[1.5vw] pl-4 "+(stat==="full"?"":"hidden")}>Courses</span>
                    </a>
                </div>
            </div>
            <div className={stat==="full"?"w-[85%]":"lg:w-[95%] w-[90%]"}>
                <Outlet />
            </div>
        </div>
    </div>
  );
};

export default MainLayout;
