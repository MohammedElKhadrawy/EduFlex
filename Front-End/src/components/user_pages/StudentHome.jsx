import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from 'react';
import {getCookie, swAlert} from "../../helpers.jsx";

const StudentHome = () => {

    let selectedCategory="Skills";
    const [courses,setCourses]=useState([]);
    const [reviews,setReviews]=useState([]);
    const [loaded,setloaded]=useState(0);
    const [auth,setAuth]=useState(false);
    const back_end_url=import.meta.env.VITE_BACK_END_URL;
    const back_end_domain=import.meta.env.VITE_BACK_END_DOMAIN;
    const [showMiddle,setShowMiddle]=useState(false);
    const [showHigh,setShowHigh]=useState(false);
    const [matched,setMatched]=useState(false);
    const [currentLevel,setCurrentLevel]=useState(null);

    useEffect(() => {
        showSlides_one(1);
        if (getCookie('user')) {
            setAuth(true);
            setMatched(true);
        }
    }, []);

    let slide_oneIndex=1;
    function plusSlide_one(n) {
        showSlides_one(slide_oneIndex += n);
    }

    function showSlides_one(n) {
        let i;
        let slides = document.getElementsByClassName("mySlidesOne");
        if (n > slides.length) {slide_oneIndex = 1}
        if (n < 1) {slide_oneIndex = slides.length}
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[slide_oneIndex-1].style.display = "block";
    }

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
        setMatched(false);
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
            if(level&&(level!="match")){
                query+='&level='+level;
            }
            let full_url="/courses/search-by-category?";
            if(level&&level=="match"){
                full_url="/courses/personalized-courses";
                query="";
            }
            if(!getCookie('user')){
                full_url="/courses/top-rated?";
            }
            const response = await fetch(back_end_url+full_url+query, requestOptions);
            const data = await response.json();
            if(response.status ===422){
                swAlert("error",data.message,data.data[0]);
            }else if(response.status ===201){
                swAlert("success",data.message);
            }else if(response.status ===200){
                if(getCookie('user')&&level==="match"){
                    setCourses(data.personalizedCourses);
                }else if(getCookie('user')){
                    setCourses(data.courses);
                }else{
                    setCourses(data.topRatedCourses);
                }
                setloaded(loaded+1);
            }

        } catch (error) {
            swAlert("global");
        }
    }

    useEffect(()=>{
        async function getReviews(){
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            };
            try {
                const response = await fetch(back_end_url+'/reviews', requestOptions);
                const data = await response.json();
                if(response.status ===422){
                    swAlert("error",data.message,data.data[0]);
                }else if(response.status ===201){
                    swAlert("success",data.message);
                }else if(response.status ===200){
                    setReviews(data.reviews);
                    setloaded(loaded+1);
                }

            } catch (error) {
                swAlert("global");
            }
        }
        getReviews();
        loadCourses("match");
    },[]);

    return (
        <div>
            <div
                className="xs:pt-[100px] pt-[80px] bg-no-repeat bg-center bg-cover bg-origin-content bg-[url(../src/assets/main-bg-blur.png)] grid grid-cols-2">
                <div className="text-white mt-[25%]">
                    <div className="ml-[20%] font-bold text-[3.5vw]">Welcome !</div>
                    <div className="ml-[22%] text-[2vw] font-semibold text-white">to our leading educational platform
                    </div>
                    <div className="search-field">
                    </div>
                </div>
                <img src="src/assets/iphone.png" className="w-[17%] pt-10 absolute lg:right-[180px] right-[80px]"/>
            </div>
            <div className="font-bold text-[#505050] text-center text-[2vw] sm:p-20 p-10">
                where knowledge meets motivation! Explore a wide range of exciting courses covering various fields, and
                embark on your journey to achieve your educational goals with seasoned experts. Choose your lessons,
                delve into engaging content, and set forth towards developing your skills and achieving both personal
                and professional success!
            </div>
            <div className="bg-[#00BF63] h-200 grid grid-cols-3 text-center text-white font-bold text-[2vw] py-4">
                <div>11M<br/>STUDENTS</div>
                <div>500<br/> ENROLLMENTS</div>
                <div>20+<br/> COUNTRIES</div>
            </div>
            <div>
                <h3 className="text-center text-[#515151] py-4 text-[2.8vw] font-bold">Start to be like them</h3>
                <hr className="border-t-[8px] border-[#00BF63] m-auto w-[20%]"/>
                <img src="src/assets/silder1/1.png" className="w-[70%] m-auto mySlidesOne fade"/>
                <img src="src/assets/silder1/2.png" className="w-[70%] m-auto mySlidesOne fade"/>
                <img src="src/assets/silder1/3.png" className="w-[70%] m-auto mySlidesOne fade"/>
                <img src="src/assets/silder1/4.png" className="w-[70%] m-auto mySlidesOne fade"/>
                <img src="src/assets/silder1/5.png" className="w-[70%] m-auto mySlidesOne fade"/>
                <div className="prev" onClick={()=>plusSlide_one(-1)}>❮</div>
                <div className="next" onClick={()=>plusSlide_one(1)}>❯</div>
            </div>
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
                    <div>
                        <h3 className="text-center text-[#515151] pt-4 text-[2.8vw] font-bold">Skills</h3>
                        <hr className="border-t-[8px] border-[#00BF63] m-auto w-[8%]"/>
                        <p className="text-black font-[600] text-[1.8vw] ml-[20%] mt-[30px]">
                            Invest in developing your personal and communication skills; they are the key to success in a rapidly changing world. By enhancing your soft skills, you will gain the ability to interact effectively with others and increase your value in the job market.
                        </p>
                    </div>
                    <div>
                        <img src="src/assets/skills.png" className="w-[60%] mt-[80px] mb-[30px] m-auto"/>
                    </div>
                </div>
                <hr className="border-t-[2px] border-[#00000080] w-[90%] m-auto"/>
                <div className="grid grid-cols-2">
                    <div className="ml-[10%]">
                        <h4 className="text-[#515151] pt-4 text-[1.8vw] font-bold">{matched?"Courses matched your education data":"Skills"}</h4>
                    </div>
                    <div className="ml-[70%] mt-[20px]">
                        <a href="/courses?category=skills" className="text-white text-[1.6vw] py-1 px-3 bg-[#00BF63] rounded-xl underline">More {">"}</a>
                    </div>
                </div>
                <div>
                    <div className="mx-[10%] my-8 grid grid-cols-4 gap-8">
                        {loaded?courses.map((course,i)=>(
                            <a href={"/student/course?id="+course._id} key={i}>
                                <img src={back_end_domain+course.imageUrl} crossOrigin="anonymous"/>
                            </a>
                        )):null}
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
                    <div>
                        <p className="mx-[10%] text-[28px] cursor-pointer back-to-skills" onClick={()=>skills_back_btn(true)}>❮</p>
                        <h3 className="text-center text-[#515151] mt-4 text-[2.8vw] font-bold">Primary Stage</h3>
                        <p className="text-black text-center font-[600] text-[1.5vw] ml-[10%] mt-[30px]">
                            Every day in elementary school is a chance to explore, learn, and have fun! Embrace the joy of discovery, for each lesson and every friendship formed is a building block for your future. With curiosity as your guide, there's no limit to what you can achieve. Enjoy this magical journey of learning and growing, and remember that every small step you take today leads to big accomplishments tomorrow.
                        </p>
                    </div>
                    <div>
                        <img src="src/assets/skills1.PNG" className="w-[80%] mt-[20px] mb-[30px] m-auto"/>
                    </div>
                </div>
                <hr className="border-t-[2px] border-[#00000080] w-[90%] m-auto"/>
                <div className="grid grid-cols-2">
                    <div className="ml-[10%]">
                        <h4 className="text-[#515151] pt-4 text-[1.8vw] font-bold">Primary Stage</h4>
                    </div>
                    <div className="ml-[70%] mt-[20px]">
                        <a href={"/courses?category=primary&level="} className="text-white text-[1.6vw] py-1 px-3 bg-[#00BF63] rounded-xl underline">More {">"}</a>
                    </div>
                </div>
                <div>
                    <div className="mx-[10%] my-8 grid grid-cols-4 gap-8">
                        {loaded?courses.map((course,i)=>(
                            <a href={"/student/course?id="+course._id} key={i}>
                                <img src={back_end_domain+course.imageUrl} crossOrigin="anonymous"/>
                            </a>
                        )):null}
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
                    <div>
                        <p className="mx-[10%] text-[28px] cursor-pointer back-to-skills" onClick={()=>skills_back_btn(true)}>❮</p>
                        <img src="src/assets/skills2.PNG" className="w-[80%] mt-[20px] mb-[50px] m-auto"/>
                    </div>
                    <div>
                        <h3 className="text-center text-[#515151] mt-4 text-[2.8vw] mr-[10%] font-bold">Middle School</h3>
                        <p className="text-black text-center font-[600] text-[1.5vw] mr-[15%] mt-[30px]">
                            Every day in elementary school is a chance to explore, learn, and have fun! Embrace the joy of discovery, for each lesson and every friendship formed is a building block for your future. With curiosity as your guide, there's no limit to what you can achieve. Enjoy this magical journey of learning and growing, and remember that every small step you take today leads to big accomplishments tomorrow.
                        </p>
                    </div>
                </div>
                <hr className="border-t-[2px] border-[#00000080] w-[90%] m-auto"/>
                <div className="grid grid-cols-2">
                    <div className="ml-[10%]">
                        <h4 className="text-[#515151] pt-4 text-[1.8vw] font-bold">Middle School</h4>
                    </div>
                    <div className="ml-[70%] mt-[20px]">
                        <a href={"/courses?category=middle&level="+currentLevel} className="text-white text-[1.6vw] py-1 px-3 bg-[#00BF63] rounded-xl underline">More {">"}</a>
                    </div>
                </div>
                <div>
                    <div className="mx-[10%] my-8 grid grid-cols-4 gap-8">
                        {loaded?courses.map((course,i)=>(
                            <a href={"/student/course?id="+course._id} key={i}>
                                <img src={back_end_domain+course.imageUrl} crossOrigin="anonymous"/>
                            </a>
                        )):null}
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
                    <div>
                        <p className="mx-[10%] text-[28px] cursor-pointer back-to-skills" onClick={()=>skills_back_btn(true)}>❮</p>
                        <h3 className="text-center text-[#515151] mt-4 text-[2.8vw] font-bold">High School</h3>
                        <p className="text-black text-center font-[600] text-[1.5vw] ml-[10%] mt-[30px]">
                            Spend your time pursuing your dreams, as every minute dedicated to learning brings you closer to your goal. Hard work and dedication build the path to a bright future, so make each day a new opportunity to develop yourself and achieve the success you deserve.
                        </p>
                    </div>
                    <div>
                        <img src="src/assets/skills3.PNG" className="w-[80%] mt-[20px] mb-[30px] m-auto"/>
                    </div>
                </div>
                <hr className="border-t-[2px] border-[#00000080] w-[90%] m-auto"/>
                <div className="grid grid-cols-2">
                    <div className="ml-[10%]">
                        <h4 className="text-[#515151] pt-4 text-[1.8vw] font-bold">High School</h4>
                    </div>
                    <div className="ml-[70%] mt-[20px]">
                        <a href={"/courses?category=high&level="+currentLevel} className="text-white text-[1.6vw] py-1 px-3 bg-[#00BF63] rounded-xl underline">More {">"}</a>
                    </div>
                </div>
                <div>
                    <div className="mx-[10%] my-8 grid grid-cols-4 gap-8">
                        {loaded?courses.map((course,i)=>(
                                <a href={"/student/course?id="+course._id} key={i}>
                                    <img src={back_end_domain+course.imageUrl} crossOrigin="anonymous"/>
                                </a>
                            )):null}
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
                    <div>
                        <p className="mx-[10%] text-[28px] cursor-pointer back-to-skills" onClick={()=>skills_back_btn(true)}>❮</p>
                        <img src="src/assets/skills4.PNG" className="w-[80%] mt-[20px] mb-[50px] m-auto"/>
                    </div>
                    <div>
                        <h3 className="text-center text-[#515151] mt-4 text-[2.8vw] mr-[10%] font-bold">University</h3>
                        <p className="text-black text-center font-[600] text-[1.5vw] mr-[15%] mt-[30px]">
                            Embrace the challenges of university life as stepping stones to your future success. Your academic journey is a canvas for personal and intellectual growth. With dedication and a thirst for knowledge, each lesson learned and every obstacle overcome is a testament to your resilience. Seize the opportunities before you, for every moment invested in your education is an investment in the extraordinary life you're building.
                        </p>
                    </div>
                </div>
                <hr className="border-t-[2px] border-[#00000080] w-[90%] m-auto"/>
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
                        {loaded?courses.map((course,i)=>(
                            <a href={"/student/course?id="+course._id} key={i}>
                                <img src={back_end_domain+course.imageUrl} crossOrigin="anonymous"/>
                            </a>
                        )):null}
                    </div>
                    {courses.length>5?(
                        <>
                            <a className="prev !bottom-[100px] lg:!bottom-[180px]">❮</a>
                            <a className="next !bottom-[100px] lg:!bottom-[180px]">❯</a>
                        </>
                    ):null}
                </div>
            </div>
            <hr className="border-t-[2px] border-[#00000080] w-[90%] m-auto"/>
            {auth?(
                <>
                    <div className="ml-[5%]">
                        <h4 className="text-[#515151] pt-4 text-[2vw] font-bold">How learners like you are achieving their goals</h4>
                        <div className="grid grid-cols-3 gap-10 mx-[5%]">
                            {loaded?reviews.map((review,i)=> (
                                <>
                                    {i<3?(
                                        <div className="w-full bg-[#F2F2F2] border-[#A9A9A9] border-[1px] h-[400px] my-4">
                                            <p className="text-black font-bold text-[3.1vw] ml-[50px]">,,</p>
                                            <p className="text-[#505050] font-bold mx-[10%] text-[1.1vw] h-[120px] my-5">
                                                {review.comment}
                                            </p>
                                            <div className="relative">
                                                <div className="ml-[50px] mt-[50px] absolute w-full bottom-[-70px]">
                                                    <span className="bg-[#00BF63] py-3 px-3 text-white font-[600] text-[1vw] rounded-full">NA</span>
                                                    <span className="text-[#505050] ml-[4%] text-[1.2vw]">{review.user.firstName+' '+review.user.lastName}</span>
                                                </div>
                                                <hr className="border-[#000000] w-[90%] left-[5%] absolute bottom-[-100px]"/>
                                                <div className="mt-[20px] absolute w-full bottom-[-150px]">
                                                    <a href={"/student/course?id="+review.course._id}>
                                                        <img src="src/assets/play_btn.png" className="w-[8%] ml-[30px] mt-[-10px] inline"/>
                                                        <div className="ml-[4%] text-[1.7vw] inline text-[#505050]">{review.course.title}</div>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ):null}
                                </>
                            )):null}

                        </div>
                    </div>
                <hr className="border-t-[2px] border-[#00000080] w-[90%] mt-4 m-auto"/>
                </>
            ):null}

            <div className="grid grid-cols-2">
                <div className="lg:ml-[45%] ml-[30%] mt-[30px]">
                    <h4 className="text-[#515151] pt-4 text-[28px] font-[800]">Download</h4>
                    <hr className="border-t-[6px] border-[#00BF63] ml-2 w-[120px]"/>
                    <img src="src/assets/googleplay.PNG" className="lg:mt-[70px] mt-[40px] ml-[-20%] w-[70%]"/>
                    <img src="src/assets/appstore.PNG" className="ml-[-20%] w-[70%]"/>
                </div>
                <div>
                    <img src="src/assets/mobiles.PNG" className="ml-[20%] mt-[50px] w-[60%]"/>
                </div>
            </div>
        </div>
    );
};

export default StudentHome;
