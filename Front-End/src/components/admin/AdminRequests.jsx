import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {getCookie,delay,swAlert} from "../../helpers";

const AdminRequests = () => {
    const [showModal, setShowModal] = React.useState(false);
    const [userData, setUserdata] = React.useState(null);
    const [auth,setAuth]=useState(false);
    const [requests,setRequests]=useState([]);
    const [dataLoaded,setDataLoaded]=useState(false);
    const back_end_url=import.meta.env.VITE_BACK_END_URL;
    const back_end_domain=import.meta.env.VITE_BACK_END_DOMAIN;
    const [showLogout,setShowLogout]=useState(false);

    useEffect(() => {
        if (getCookie('user')) {
            setAuth(true);
            setUserdata(JSON.parse(getCookie('user')));
        }
        const getRequests = async () => {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+getCookie('token') },
            };
            try {
                const response = await fetch(back_end_url+'/courses?status=Pending', requestOptions);
                const data = await response.json();
                if(response.status ===422){
                    swAlert("error",data.message,data.data[0]);
                }else if(response.status ===201){
                    swAlert("success",data.message);
                }else if(response.status ===200){
                    setRequests(data.courses);
                    setDataLoaded(true);
                }

            } catch (error) {
                swAlert("global");
            }
        };
        getRequests();
    }, []);

    const [details,setDetails]=useState([]);
    function showDetails(i){
        setDetails(requests[i]);
        delay(100);
        setShowModal(true);
    }

    const acceptCourse = async (id,stat) => {
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+getCookie('token') },
            body:JSON.stringify({status:stat}),
        };
        try {
            const response = await fetch(back_end_url+'/courses/'+id, requestOptions);
            const data = await response.json();
            if(response.status ===422){
                swAlert("error",data.message,data.data[0]);
            }else if(response.status ===201||response.status ===200){
                swAlert("success",data.message);
            }
        } catch (error) {
            swAlert("global");
        }
    };
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
            <h1 className="ml-[8%] mt-[20px] text-[1.8vw] font-bold">Requests</h1>
            <p className=" ml-[8%] text-[#505050] text-[1.3vw] font-[500]">Overview</p>
            <div className="grid grid-cols-2 mx-[10%]">
                {dataLoaded?(
                    <>
                        {requests.map((data,i)=>(
                            <div className={"border-y border-black"+((i%2)==0?" border-r":"")+((i<2)?" mt-4":"")} key={i} id={i}>
                                <img src='../src/assets/users/user2.png' className='w-[10%] rounded-full inline my-[6%] ml-6'/>
                                <span className="ml-[10px] font-[500] text-[1vw]">{data.instructor.firstName+" "+data.instructor.lastName}</span>
                                <img src={back_end_domain+data.imageUrl} className="w-[70%] m-auto" crossOrigin="anonymous"/>
                                <div className="w-[70%] m-auto my-4 relative">
                                    <span className="text-black text-[1vw] font-[600]">{data.title}</span>
                                    <img src="../src/assets/admin_icons/eye.PNG" className="inline w-[1.8vw] absolute right-0 cursor-pointer" onClick={()=>showDetails(i)}/>
                                </div>
                            </div>
                        ))}
                    </>
                ):null}
            </div>
            {dataLoaded&&requests.length===0?(
                <div className="text-center text-[2.5vw] mt-[10%] text-[#8d8d8d]">
                    There are no new requests
                </div>
            ):null}

            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-2xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="p-5">
                                    <button className="p-1 ml-auto bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none" onClick={() => setShowModal(false)}>
                                            <img src="../src/assets/arrow_left.png" className="w-[30px]"/>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="relative px-6 py-2 flex-auto">
                                    <div className="grid grid-cols-2">
                                        <div className="border-r-2 font-[500]">
                                            <img src={back_end_domain+details.imageUrl} className="w-[100%]" crossOrigin="anonymous"/>
                                            <p>Education: {details.education}</p>
                                            <p>Stage: {details.stage}</p>
                                            <p>Level: {details.level}</p>
                                            <p>Language of course: {details.language}</p>
                                            <p>Term: {details.term}</p>
                                        </div>
                                        <div className="ml-5 font-[500]">
                                            <p className="ml-5 mb-[12%]">Course Name:{details.title}</p>
                                            <p className="ml-5 mb-[25%]">Course Description:{details.description}</p>
                                            <p>Subject:{details.subject}</p>
                                            <p>Course Availability:{details.courseAvailability}</p>
                                            <p>Limited period:{details.limitedPeriod}</p>
                                            <p>Key words:{details.keywords}</p>
                                            <p>Price:{details.price}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 rounded-b grid grid-cols-2">
                                    <div className="cursor-pointer bg-[#00BF63] py-2 text-white text-center mx-[60px] my-4 rounded-[10px] font-bold text-[20px]" onClick={()=>acceptCourse(details.id,"Accepted")}>
                                        Accept
                                    </div>
                                    <div className="cursor-pointer bg-[#FF2828] py-2 text-white text-center mx-[60px] my-4 rounded-[10px] font-bold text-[20px]" onClick={()=>acceptCourse(details.id,"Rejected")}>
                                        Reject
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

export default AdminRequests;
