import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {getCookie, swAlert} from "../../helpers.jsx";

const AdminCourses = () => {
    const [courses,setCourses]=useState([]);
    const [dataLoaded,setDataLoaded]=useState(false);
    const [userData, setUserdata] = React.useState(null);
    const back_end_url=import.meta.env.VITE_BACK_END_URL;
    const back_end_domain=import.meta.env.VITE_BACK_END_DOMAIN;
    const [showLogout,setShowLogout]=useState(false);

    useEffect(()=>{
        if (getCookie('user')) {
            setUserdata(JSON.parse(getCookie('user')));
        }

        const getCourses = async () => {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+getCookie('token') },
            };
            try {
                const queryParams = new URLSearchParams(window.location.search);
                const response = await fetch(back_end_url+'/courses/user-courses?userId='+queryParams.get("user"), requestOptions);
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
            <h1 className="ml-[8%] mt-[20px] text-[1.8vw] font-bold">User Courses</h1>
            <p className=" ml-[8%] text-[#505050] text-[1.3vw] font-[500]">Overview</p>
            <div className="mx-[5%] my-8 grid grid-cols-5 gap-8">
                {courses.map((course,i)=>(
                    <span key={i}>
                        <a href={"/student/course/view?id="+course._id}>
                            <img src={back_end_domain+course.imageUrl} crossOrigin="anonymous"/>
                            <div className="w-[70%] m-auto my-4 relative">
                            <span className="text-black text-[1vw] font-[600]">{course.title}</span>
                        </div>
                        </a>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default AdminCourses;
