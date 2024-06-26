import React, {useEffect, useState} from "react";
import {getCookie, delay, swAlert} from "../../helpers.jsx";
import axios from "axios";

const StudentVideoView = () => {
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

    const [currVid,setCurrVid]=useState(null);
    const [currVidTitle,setCurrVidTitle]=useState(null);

    function playVideo(section,video,title){
        setCurrVidTitle(title);
        setCurrVid(back_end_url+"/courses/"+course._id+'/sections/'+section+'/videos/'+video+'?token='+getCookie("token"))
    }

    useEffect(() => {
        if (currVidTitle!==null) {
            const videoElement = document.querySelector('#curr-vid');
            videoElement.srcObject = null;
            videoElement.src = currVid;
            videoElement.load();
        }
    }, [currVid]);

    return (
        <div className="pt-[100px]">
            <div className="flex">
                <div className="relative bg-[#F5F5F5] h-lvh min-h-screen w-[15%]">
                    <p className="text-[#00BF63] font-[Roboto] font-[900] italic text-center my-4 text-[1.5vw]">
                        {dataLoaded?course.title:null}
                    </p>
                    {dataLoaded?course.sections.map((sec,index)=>(
                        <div key={index}>
                            <div className="mt-[20px] mb-[5px]">
                                <p className="ml-5 font-[500] text-[1.1vw] inline">{sec.title}</p>
                            </div>
                            {sec.videos.map((vid,i)=>(
                                <div className="bg-[#D9D9D9] w-full py-2 text-[16px] text-[#19BA6E] font-[600] cursor-pointer border-b-[1px] border-[#888888] relative"
                                     key={index+i} onClick={()=>playVideo(index,i,vid.title)}>
                                    <img src="../../src/assets/play_tin.png" className="mx-1 inline w-[1.3vw] relative bottom-[0.15vw]"/>
                                    <span>{i}- {vid.title+" "+vid.formattedDuration}</span>
                                </div>
                            ))}
                        </div>
                    )):null}
                    <a href={"/student/course/rating?id="+course._id}>
                        <div className="w-[80%] text-[#00BF63] bg-[#EBEBEB] font-[700] py-2 text-center my-10 m-auto text-[1.3vw] rounded-[10px] cursor-pointer">
                            Rating course
                        </div>
                    </a>
                </div>
                <div className="w-[85%]">
                    <p className="font-[Roboto] font-[600] text-[#525252] text-[2vw] ml-8 mt-10">{currVidTitle??"VIDEO TITLE"}</p>
                    {currVidTitle!==null?(
                        <video className="w-[50%] aspect-video m-auto mt-[20px]" controls id="curr-vid">
                            <source src="" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ):(
                        <div className="bg-[#D9D9D9] w-[50%] aspect-video m-auto mt-[20px] pt-[8%]">
                            <img src="../../src/assets/play.png" className="w-[20%] m-auto"/>
                        </div>
                    )}
                    <div className="cursor-pointer bg-[#00BF63] py-2 text-white text-center w-[30%] my-6 m-auto rounded-[10px] font-bold text-[1.6vw]">
                        COMPLETE AND Continue
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentVideoView;
