import React, {useEffect, useState} from "react";
import {getCookie, swAlert} from "../../helpers.jsx";

const StudentCourseView = () => {
    const [courses,setCourses]=useState([]);
    const [dataLoaded,setDataLoaded]=useState(false);
    const back_end_url=import.meta.env.VITE_BACK_END_URL;
    const back_end_domain=import.meta.env.VITE_BACK_END_DOMAIN;

    const queryParams = new URLSearchParams(window.location.search);
    const categoryMap={'primary':"Primary School",'middle':'Middle School','high':'High School','university':'University','skills':'Skills'}
    const levelMap=['Level One','Level Two','Level Three'];
    const [term,setTerm]=useState(1);

    let isTermatic=false;
    if(queryParams.get("category")==='middle'||(queryParams.get("category")==='high'&&(queryParams.get("level")!=3))){
        isTermatic=true;
    }

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
                const response = await fetch(back_end_url+'/courses/search-by-category?category='+queryParams.get("category")+'&level='+queryParams.get("level")+'&term='+term, requestOptions);
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
    },[term]);
    return (
        <div className="pt-[150px]">
            <div className="flex">
                <h2 className="font-[700] ml-[10%] text-[1.5vw] w-[40%]">{categoryMap[queryParams.get('category')]+': '+(queryParams.get('level')?levelMap[queryParams.get('level')-1]:'')}</h2>
                {isTermatic?(
                    <div className="w-[60%] flex">
                        <div className={"text-[1.3vw] py-1 px-3 rounded-xl h-[40px] cursor-pointer"+(term===2?' bg-[#00BF63] text-white':' bg-[#D9D9D9]')} onClick={()=>setTerm(1)}>First Term</div>
                        <div className={"text-[1.3vw] py-1 px-3 rounded-xl ml-4 h-[40px] cursor-pointer"+(term===1?' bg-[#00BF63] text-white':' bg-[#D9D9D9]')} onClick={()=>setTerm(2)}>Second Term</div>
                    </div>
                ):null}
            </div>
            <div>
                <div className="mx-[5%] my-8 grid grid-cols-5 gap-8">
                    {courses.map((course,i)=>(
                        course.status!=="Rejected"?(
                                <span key={i}>
                                   <a href={"/student/course?id="+course._id}>
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
