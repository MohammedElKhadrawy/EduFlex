import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {getCookie, swAlert} from "../../helpers.jsx";

const AdminStudents = () => {
    const [students,setStudents]=useState([]);
    const [dataLoaded,setDataLoaded]=useState(false);
    const back_end_url=import.meta.env.VITE_BACK_END_URL;
    const back_end_domain=import.meta.env.VITE_BACK_END_DOMAIN;
    const [userData, setUserdata] = React.useState(null);
    const [auth,setAuth]=useState(false);
    const [showLogout,setShowLogout]=useState(false);

    useEffect(()=>{
        if (getCookie('user')) {
            setAuth(true);
            setUserdata(JSON.parse(getCookie('user')));
        }
        const getStudents = async () => {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+getCookie('token') },
            };
            try {
                const response = await fetch(back_end_url+'/users?role=Student', requestOptions);
                const data = await response.json();
                if(response.status ===422){
                    swAlert("error",data.message,data.data[0]);
                }else if(response.status ===201){
                    swAlert("success",data.message);
                }else if(response.status ===200){
                    setStudents(data);
                    setDataLoaded(true);
                }

            } catch (error) {
                swAlert("global");
            }
        };
        getStudents();
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
            <h1 className="ml-[8%] mt-[20px] text-[1.8vw] font-bold">Students</h1>
            <p className=" ml-[8%] text-[#505050] text-[1.3vw] font-[500]">Overview</p>
            <div className="w-[20%] bg-gradient-to-b from-[#D0D0D0] to-[#f2f2f28c] ml-[10%] my-4 rounded-[10px]">
                <img src="../src/assets/admin_icons/student_col.PNG" className="m-5 mr-3 w-[2.4vw] inline"/>
                <span className="text-[#1A1A1A] font-[600] text-[1.6vw] relative top-[5px]">Total Students</span>
                <div className="m-auto mx-[30%] relative bottom-[20px]">
                    <span className="text-[#808080] font-bold text-[1.3vw]">{(dataLoaded?students.totalCount:"")}</span>
                    <img src="../src/assets/admin_icons/trend.PNG" className="relative bottom-[0.5vw] ml-[10%] w-[2vw] inline"/>
                </div>
            </div>
            <h1 className="ml-[8%] mt-[50px] text-[1.8vw] font-bold">Registered students</h1>
            <table className="mx-[10%] m-auto w-[80%] text-center mt-[20px] table-fixed">
                <thead className="bg-[#00BF63] text-white">
                <tr>
                    <th className="py-3 rounded-l-[10px]">Student ID</th>
                    <th>Name</th>
                    <th>E-Mail</th>
                    <th>Owended Courses</th>
                    <th className="rounded-r-[10px]">Actions</th>
                </tr>
                </thead>
                <tbody>
                {dataLoaded?(
                    <>
                        {students.users.map((data,i)=>(
                            <tr className="border-b-2 border-[#E6E6E6]" key={i}>
                                <td className="mt-[5px] text-[#28609C] font-bold">{data._id}</td>
                                <td>
                                    <img src={back_end_domain+data.profilePicture} className="w-[20%] my-2 rounded-full inline" crossOrigin="anonymous"/>
                                    <span className="ml-[10px]">{data.firstName+" "+data.lastName}</span>
                                </td>
                                <td>{data.email}</td>
                                <td>10</td>
                                <td>
                                    <a href={"/admin/user-courses?user="+data._id}>
                                        <img src="../src/assets/admin_icons/eye.PNG" className="inline w-[1.8vw] cursor-pointer"/>
                                    </a>
                                    <img src="../src/assets/admin_icons/trash.PNG" className="inline w-[1.5vw] ml-2 cursor-pointer"/>
                                </td>
                            </tr>
                        ))}
                    </>
                ):null}
                </tbody>
            </table>
            <div className="flex mx-[10%] mt-6 text-[#747474]">
                <span>{dataLoaded?students.users.length:''} of {dataLoaded?students.users.length:''} items</span>
                <div className="ml-[30%] text-[#165394]">

                </div>
            </div>
        </div>
    );
};

export default AdminStudents;
