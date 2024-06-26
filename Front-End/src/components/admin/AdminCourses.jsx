import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {getCookie, swAlert} from "../../helpers.jsx";

const AdminCourses = () => {
    const [courses,setCourses]=useState([]);
    const [coursesTopRated,setCoursesTopRated]=useState([]);
    const [dataLoaded,setDataLoaded]=useState(false);
    const [loaded,setLoaded]=useState(0);
    const back_end_url=import.meta.env.VITE_BACK_END_URL;
    const back_end_domain=import.meta.env.VITE_BACK_END_DOMAIN;
    const [userData, setUserdata] = React.useState(null);
    const [totalPrice,setTotalPrice]=useState(0);
    const [totalRun,setTotalRun]=useState(0);
    const [showMiddle,setShowMiddle]=useState(false);
    const [showHigh,setShowHigh]=useState(false);
    const [currentLevel,setCurrentLevel]=useState(null);
    const [showLogout,setShowLogout]=useState(false);
    let selectedCategory="Skills";

    useEffect(()=>{
        if (getCookie('user')) {
            setUserdata(JSON.parse(getCookie('user')));
        }
        const getTopRated = async () => {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+getCookie('token') },
            };
            try {
                const response = await fetch(back_end_url+'/courses/top-rated', requestOptions);
                const data = await response.json();
                if(response.status ===422){
                    swAlert("error",data.message,data.data[0]);
                }else if(response.status ===201){
                    swAlert("success",data.message);
                }else if(response.status ===200){
                    setCoursesTopRated(data.topRatedCourses);
                }
            } catch (error) {
                swAlert("global");
            }
        };
        getTopRated();
        const getCourses = async () => {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+getCookie('token') },
            };
            try {
                const response = await fetch(back_end_url+'/courses', requestOptions);
                const data = await response.json();
                if(response.status ===422){
                    swAlert("error",data.message,data.data[0]);
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


    useEffect(()=>{
        function coursesAnalysis(){
            let total=0,run=0;
            courses.map((course,i)=>{
                total+=course.price*course.enrollments.length;
                if(course.status==="Accepted"){
                    run++;
                }
            });
            setTotalPrice(total);
            setTotalRun(run);
        }
        coursesAnalysis();
    },[courses]);

    function primary_btn(){
        let general_skills = document.getElementById("general-skills");
        let primary_skills = document.getElementById("primary-skills");
        skills_back_btn();
        selectedCategory="primary";
        loadCourses();
        setCurrentLevel(null);
        general_skills.style.display = "none";
        primary_skills.style.display = "block";
    }

    function middle_btn(level){
        let general_skills = document.getElementById("general-skills");
        let middle_skills = document.getElementById("middle-skills");
        skills_back_btn();
        selectedCategory="middle";
        loadCourses(level);
        setCurrentLevel(level);
        setShowMiddle(false);
        general_skills.style.display = "none";
        middle_skills.style.display = "block";
    }

    function high_btn(level){
        let general_skills = document.getElementById("general-skills");
        let high_skills = document.getElementById("high-skills");
        skills_back_btn();
        selectedCategory="high";
        loadCourses(level);
        setCurrentLevel(level);
        setShowHigh(false);
        general_skills.style.display = "none";
        high_skills.style.display = "block";
    }

    function univ_btn(){
        let general_skills = document.getElementById("general-skills");
        let univ_skills = document.getElementById("univ-skills");
        skills_back_btn();
        selectedCategory="university";
        loadCourses();
        setCurrentLevel(null);
        general_skills.style.display = "none";
        univ_skills.style.display = "block";
    }

    function skills_back_btn(selected=false){
        let general_skills = document.getElementById("general-skills");
        let primary_skills = document.getElementById("primary-skills");
        let middle_skills = document.getElementById("middle-skills");
        let high_skills = document.getElementById("high-skills");
        let univ_skills = document.getElementById("univ-skills");
        selectedCategory="skills";
        if(selected){
            loadCourses();
            setCurrentLevel(null);
        }
        general_skills.style.display = "block";
        primary_skills.style.display = "none";
        middle_skills.style.display = "none";
        high_skills.style.display = "none";
        univ_skills.style.display = "none";
    }

    async function loadCourses(level=null){
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+getCookie('token') },
        };
        try {
            let query='category='+selectedCategory;
            if(level){
                query+='&level='+level;
            }
            const response = await fetch(back_end_url+'/courses/search-by-category?'+query, requestOptions);
            const data = await response.json();
            if(response.status ===422){
                swAlert("error",data.message,data.data[0]);
            }else if(response.status ===201){
                swAlert("success",data.message);
            }else if(response.status ===200){
                setCourses(data.courses);
                setLoaded(loaded+1);
            }

        } catch (error) {
            swAlert("global");
        }
    }
    function logout(){
        document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href="/";
    }
    return (
        <div>
            <div className="ml-[10%] mt-[20px] flex">
                <div className="w-[30%] relative">
                    <img src={userData?(back_end_domain+userData.profilePicture):null} className="w-[18%] rounded-full inline" crossOrigin="anonymous"/>
                    <span className="ml-[10px] font-[500] text-[1.3vw]">{userData?userData.name:""}</span>
                    <img src="../src/assets/arrow_down.png" className="inline ml-[10px] w-[20px]" onClick={()=>setShowLogout(!showLogout)}/>
                    {showLogout?(
                        <div id="dropdown" className={"z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute top-[40px] left-[30%]"}>
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                <li>
                                    <div className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={logout}>
                                        Logout
                                    </div>
                                </li>
                            </ul>
                        </div>
                    ):null}
                </div>
            </div>
            <h1 className="ml-[8%] mt-[20px] text-[1.8vw] font-bold">Courses</h1>
            <p className=" ml-[8%] text-[#505050] text-[1.3vw] font-[500]">Overview</p>
            <div className="flex">
                <div className="w-[20%] bg-gradient-to-b from-[#D0D0D0] to-[#f2f2f28c] ml-[10%] my-4 rounded-[10px]">
                    <img src="../src/assets/admin_icons/book.PNG" className="m-5 mr-3 w-[2.1vw] inline"/>
                    <span className="text-[#1A1A1A] font-[600] text-[1.2vw] relative top-[5px]">Running Courses</span>
                    <div className="m-auto mx-[30%] relative bottom-[20px] relative top-[-0.8vw]">
                        <span className="text-[#808080] font-bold text-[1vw]">{totalRun} Courses</span>
                        <img src="../src/assets/admin_icons/trend.PNG" className="relative bottom-[0.3vw] ml-[4%] w-[1.7vw] inline"/>
                    </div>
                </div>
                <div className="w-[20%] bg-gradient-to-b from-[#D0D0D0] to-[#f2f2f28c] ml-[20px] my-4 rounded-[10px]">
                    <img src="../src/assets/admin_icons/money.PNG" className="m-5 mr-3 w-[2.1vw] inline"/>
                    <span className="text-[#1A1A1A] font-[600] text-[1.2vw] relative top-[5px]">Income till now</span>
                    <div className="m-auto mx-[30%] relative bottom-[20px]">
                        <span className="text-[#808080] font-bold text-[1vw]">$ {totalPrice}</span>
                        <img src="../src/assets/admin_icons/trend.PNG" className="relative bottom-[0.3vw] ml-[4%] w-[1.7vw] inline"/>
                    </div>
                </div>
            </div>
            <h1 className="ml-[8%] mt-[50px] text-[1.8vw] font-bold">Top Rated Courses</h1>
            <div className="mx-[10%] m-auto grid grid-cols-4">
                {dataLoaded?coursesTopRated.map((course,i)=>(
                    <div key={i}>
                        <img src="../src/assets/users/default_user.png" className="w-[10%] rounded-full inline my-[6%] ml-6"/>
                        <span className="ml-[10px] font-[500] text-[1vw]">{course.instructor.firstName+" "+course.instructor.lastName}</span>
                        <img src={back_end_domain+course.imageUrl} className="w-[80%] m-auto"/>
                        <div className="w-[70%] m-auto my-4 relative">
                            <span className="text-black text-[1vw] font-[600]">{course.title}</span>
                        </div>
                    </div>
                )):null
                }

            </div>
            {coursesTopRated.length>5?(
               <>
                   <a className="prev-admin">❮</a>
                   <a className="next-admin">❯</a>
               </>
            ):null}
            <hr className="border-t-[2px] border-[#00000080] w-[90%] m-auto"/>
            <h3 className="text-center text-[#515151] py-4 text-[2.8vw] font-bold">Categories</h3>
            <hr className="border-t-[8px] border-[#00BF63] m-auto w-[10%]"/>
            <div className="grid grid-cols-3 gap-10 w-[90%] m-auto my-5">
                <div>
                    <p className="bg-[#D9D9D9] text-[#263238] text-b py-5 px-10 mt-1 rounded-xl text-center w-full opacity-100 block cursor-pointer" onClick={primary_btn}>
                        Primary Stage
                    </p>
                </div>
                <div className="relative">
                    <p className="bg-[#D9D9D9] text-[#263238] text-b py-5 px-10 mt-1 rounded-xl text-center w-full opacity-100 block cursor-pointer" onClick={()=>setShowMiddle(!showMiddle)}>
                        Middle school
                    </p>
                    {showMiddle?(
                        <div id="dropdown" className={"z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute w-[100%] top-[110%]"}>
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" >
                                <li>
                                    <p className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white border-b-[1px] border-[#BEBEBE] cursor-pointer" onClick={()=>middle_btn(1)}>
                                        Level One
                                    </p>
                                </li>
                                <li>
                                    <p className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white border-b-[1px] border-[#BEBEBE] cursor-pointer" onClick={()=>middle_btn(2)}>
                                        Level Two
                                    </p>
                                </li>
                                <li>
                                    <p className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer" onClick={()=>middle_btn(3)}>
                                        Level Three
                                    </p>
                                </li>
                            </ul>
                        </div>
                    ):null}
                </div>
                <div className="relative">
                    <p className="bg-[#D9D9D9] text-[#263238] text-b py-5 px-10 mt-1 rounded-xl text-center w-full opacity-100 block cursor-pointer" onClick={()=>setShowHigh(!showHigh)}>
                        High school
                    </p>
                    {showHigh?(
                        <div id="dropdown" className={"z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute w-[100%] top-[110%]"}>
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" >
                                <li>
                                    <p className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white border-b-[1px] border-[#BEBEBE] cursor-pointer" onClick={()=>high_btn(1)}>
                                        Level One
                                    </p>
                                </li>
                                <li>
                                    <p className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white border-b-[1px] border-[#BEBEBE] cursor-pointer" onClick={()=>high_btn(2)}>
                                        Level Two
                                    </p>
                                </li>
                                <li>
                                    <p className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer" onClick={()=>high_btn(3)}>
                                        Level Three
                                    </p>
                                </li>
                            </ul>
                        </div>
                    ):null}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-10 w-[60%] m-auto my-5">
                <div>
                    <p className="bg-[#D9D9D9] text-[#263238] text-b py-5 px-10 mt-1 rounded-xl text-center w-full opacity-100 block cursor-pointer" onClick={univ_btn}>
                        University
                    </p>
                </div>
                <div>
                    <p className="bg-[#D9D9D9] text-[#263238] text-b py-5 px-10 mt-1 rounded-xl text-center w-full opacity-100 block cursor-pointer" onClick={skills_back_btn}>
                        Skills
                    </p>
                </div>
            </div>
            <hr className="border-t-[2px] border-[#00000080] w-[90%] m-auto"/>
            <div id="general-skills">
                <div className="grid grid-cols-2">
                    <div className="ml-[10%]">
                        <h4 className="text-[#515151] pt-4 text-[1.8vw] font-bold">Skills</h4>
                    </div>
                    <div className="ml-[70%] mt-[20px]">
                        <a href="/courses?category=skills" className="text-white text-[1.6vw] py-1 px-3 bg-[#00BF63] rounded-xl underline">More {">"}</a>
                    </div>
                </div>
                <div>
                    <div className="mx-[10%] my-8 grid grid-cols-4 gap-8">
                        {courses.map((course,i)=>(
                            course.status==="Accepted"?(
                                <a href={"/student/course?id="+course._id} key={i}>
                                    <img src={back_end_domain+course.imageUrl} crossOrigin="anonymous"/>
                                </a>
                            ):null
                        ))}
                    </div>
                    {courses.length>5?(
                        <>
                            <a className="prev !bottom-[100px] lg:!bottom-[180px]">❮</a>
                            <a className="next !bottom-[100px] lg:!bottom-[180px]">❯</a>
                        </>
                    ):null}
                </div>
            </div>
            <div id="primary-skills" className="hidden">
                <div className="grid grid-cols-2">
                    <div className="ml-[10%]">
                        <h4 className="text-[#515151] pt-4 text-[1.8vw] font-bold">Primary Stage</h4>
                    </div>
                    <div className="ml-[70%] mt-[20px]">
                        <a href="/courses?category=primary" className="text-white text-[1.6vw] py-1 px-3 bg-[#00BF63] rounded-xl underline">More {">"}</a>
                    </div>
                </div>
                <div>
                    <div className="mx-[10%] my-8 grid grid-cols-4 gap-8">
                        {courses.map((course,i)=>(
                            course.status==="Accepted"?(
                                <a href={"/student/course?id="+course._id} key={i}>
                                    <img src={back_end_domain+course.imageUrl} crossOrigin="anonymous"/>
                                </a>
                            ):null
                        ))}
                    </div>
                    {courses.length>5?(
                        <>
                            <a className="prev !bottom-[100px] lg:!bottom-[180px]">❮</a>
                            <a className="next !bottom-[100px] lg:!bottom-[180px]">❯</a>
                        </>
                    ):null}
                </div>
            </div>
            <div id="middle-skills" className="hidden">
                <div className="grid grid-cols-2">
                    <div className="ml-[10%]">
                        <h4 className="text-[#515151] pt-4 text-[1.8vw] font-bold">Middle School</h4>
                    </div>
                    <div className="ml-[70%] mt-[20px]">
                        <a href="/courses?category=middle" className="text-white text-[1.6vw] py-1 px-3 bg-[#00BF63] rounded-xl underline">More {">"}</a>
                    </div>
                </div>
                <div>
                    <div className="mx-[10%] my-8 grid grid-cols-4 gap-8">
                        {courses.map((course,i)=>(
                            course.status==="Accepted"?(
                                <a href={"/student/course?id="+course._id} key={i}>
                                    <img src={back_end_domain+course.imageUrl} crossOrigin="anonymous"/>
                                </a>
                            ):null
                        ))}
                    </div>
                    {courses.length>5?(
                        <>
                            <a className="prev !bottom-[100px] lg:!bottom-[180px]">❮</a>
                            <a className="next !bottom-[100px] lg:!bottom-[180px]">❯</a>
                        </>
                    ):null}
                </div>
            </div>
            <div id="high-skills" className="hidden">
                <div className="grid grid-cols-2">
                    <div className="ml-[10%]">
                        <h4 className="text-[#515151] pt-4 text-[1.8vw] font-bold">High School</h4>
                    </div>
                    <div className="ml-[70%] mt-[20px]">
                        <a href="/courses?category=high" className="text-white text-[1.6vw] py-1 px-3 bg-[#00BF63] rounded-xl underline">More {">"}</a>
                    </div>
                </div>
                <div>
                    <div className="mx-[10%] my-8 grid grid-cols-4 gap-8">
                        {courses.map((course,i)=>(
                            course.status==="Accepted"?(
                                <a href={"/student/course?id="+course._id} key={i}>
                                    <img src={back_end_domain+course.imageUrl} crossOrigin="anonymous"/>
                                </a>
                            ):null
                        ))}
                    </div>
                    {courses.length>5?(
                        <>
                            <a className="prev !bottom-[100px] lg:!bottom-[180px]">❮</a>
                            <a className="next !bottom-[100px] lg:!bottom-[180px]">❯</a>
                        </>
                    ):null}
                </div>
            </div>
            <div id="univ-skills" className="hidden">
                <div className="grid grid-cols-2">
                    <div className="ml-[10%]">
                        <h4 className="text-[#515151] pt-4 text-[1.8vw] font-bold">University</h4>
                    </div>
                    <div className="ml-[70%] mt-[20px]">
                        <a href="/courses?category=university" className="text-white text-[1.6vw] py-1 px-3 bg-[#00BF63] rounded-xl underline">More {">"}</a>
                    </div>
                </div>
                <div>
                    <div className="mx-[10%] my-8 grid grid-cols-4 gap-8">
                        {courses.map((course,i)=>(
                            course.status==="Accepted"?(
                                <a href={"/student/course?id="+course._id} key={i}>
                                    <img src={back_end_domain+course.imageUrl} crossOrigin="anonymous"/>
                                </a>
                            ):null
                        ))}
                    </div>
                    {courses.length>5?(
                        <>
                            <a className="prev !bottom-[100px] lg:!bottom-[180px]">❮</a>
                            <a className="next !bottom-[100px] lg:!bottom-[180px]">❯</a>
                        </>
                    ):null}
                </div>
            </div>
        </div>
    );
};

export default AdminCourses;
