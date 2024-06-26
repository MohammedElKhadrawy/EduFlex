import React, {useEffect, useState} from "react";
import {delay, getCookie, swAlert} from "../../helpers.jsx";
import {useDropzone} from "react-dropzone";

const InstructorUpload = () => {
    const [course,setCourse]=useState([]);
    const [dataLoaded,setDataLoaded]=useState(false);
    const back_end_url=import.meta.env.VITE_BACK_END_URL;
    const back_end_domain=import.meta.env.VITE_BACK_END_DOMAIN;

    const [editSec,setEditSec]=useState([]);
    const [updateStatus,setUpdateStatus]=useState(0);
    const [updateEditStatus,setUpdateEditStatus]=useState(0);
    let maxSecIndex=0;

    useEffect(()=>{
        if(!getCookie('token')||JSON.parse(getCookie('user')).role!=="Instructor"){
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
                    if(data.course.sections.length>0&&!dataLoaded) {
                        data.course.sections.map((sec, i) => {
                            let sectionVideos=[];
                            sec.videos.map((vid,j)=>{
                              sectionVideos.push({title:vid.title,duration:vid.formattedDuration,file:null,edit:false,showMenu:false,new:false,id:vid._id,index:j,url:vid.videoUrl});
                            })
                            editSec.push({edit:false,text:sec.title,videos:sectionVideos,new:false,id:sec._id,index:i});
                            maxSecIndex++;
                            setUpdateStatus(updateStatus+1);
                        });
                    }
                    setDataLoaded(true);
                }

            } catch (error) {
                swAlert("global");
            }
        };
        getCourse();
    },[]);

    function addSection() {
        editSec.push({edit:false,text:"Section "+updateStatus,videos:[],new:true,id:null,index:maxSecIndex});
        maxSecIndex++;
        setUpdateStatus(updateStatus+1);
    }

    function editSection(id){
        editSec[id].edit=editSec[id].edit !== true;
        setUpdateEditStatus(updateEditStatus+1);
    }

    let uploadSectionId;
    const {open} = useDropzone({
        accept: {"video/mp4": ['.mp4', '.MP4']},
        onDrop: (acceptedFiles) => {
            editSec[uploadSectionId].videos.push({title:"Video",file:acceptedFiles[0],edit:false,showMenu:false,new:true,id:null,index:null,url:null});
            setUpdateEditStatus(updateEditStatus+1);
        },
    });
    function showMenu(sectionId,videoId){
        editSec.map((sec,ii)=>{
            editSec[ii].videos.map((vid,i)=>{
                if(ii!==sectionId||i!==videoId)
                    editSec[ii].videos[i].showMenu=false;
            });
        });
        editSec[sectionId].videos[videoId].showMenu=editSec[sectionId].videos[videoId].showMenu !== true;
        setUpdateEditStatus(updateEditStatus+1);
    }
    function editVideo(sectionId,videoId){
        editSec[sectionId].videos[videoId].showMenu=false;
        editSec[sectionId].videos[videoId].edit=editSec[sectionId].videos[videoId].edit !== true;
        setUpdateEditStatus(updateEditStatus-1);
    }
    async function removeVideo(sectionId,videoId){
        let temp=[];
        for(let i=0;i<editSec[sectionId].videos.length;i++){
            if(i!==videoId){
                temp.push(editSec[sectionId].videos[i]);
            }
        }
        editSec[sectionId].videos=temp;
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+getCookie('token') },
        };
        try {
            const queryParams = new URLSearchParams(window.location.search);
            const response = await fetch(back_end_url+'/courses/'+queryParams.get("id")+'/sections/'+sectionId+'/videos/'+videoId, requestOptions);
            const data = await response.json();
            if(response.status ===422){
                swAlert("error",data.message,data.data[0]);
            }
        } catch (error) {
            swAlert("global");
        }
        setUpdateEditStatus(updateEditStatus-1);
    }

    const [currentTitle,setCurrentTitle]=useState('VIDEO TITLE');
    const [currentVideo,setCurrentVideo]=useState(null);
    const [currentVideoNew,setCurrentVideoNew]=useState(false);
    function playVideo(sectionId,videoId){
        setCurrentVideo(null);
        setCurrentTitle("VIDEO TITLE");
        setCurrentTitle(editSec[sectionId].videos[videoId].title);
        if(editSec[sectionId].videos[videoId].new){
            setCurrentVideo(editSec[sectionId].videos[videoId].file);
            setCurrentVideoNew(false);
        }else{
            setCurrentVideo([sectionId,videoId]);
            setCurrentVideoNew(true);
        }
    }
    useEffect(() => {
        if (currentTitle!=="VIDEO TITLE") {
            let videoUrl;
            if(currentVideoNew){
                videoUrl = back_end_url+"/courses/"+course._id+'/sections/'+currentVideo[0]+'/videos/'+currentVideo[1]+'?token='+getCookie("token");
            }else{
                videoUrl = URL.createObjectURL(currentVideo);
            }
            const videoElement = document.querySelector('#curr-vid');
            videoElement.srcObject = null;
            videoElement.src = videoUrl;
            videoElement.load();
        }
    }, [currentVideo]);

    const updateCourse=async ()=>{
        await Promise.all(
            editSec.map(async (sec,ii)=>{
                if(sec.new){
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+getCookie('token') },
                        body:JSON.stringify({sectionTitle:sec.text}),
                    };
                    try {
                        const queryParams = new URLSearchParams(window.location.search);
                        const response = await fetch(back_end_url+'/courses/'+queryParams.get("id")+'/sections', requestOptions);
                        const data = await response.json();
                        if(response.status ===422){
                            swAlert("error",data.message,data.data[0]);
                        }else if(response.status ===201||response.status ===200){
                            videosManagement(ii);
                        }
                    } catch (error) {
                        swAlert("global");
                    }
                }else{
                    const requestOptions = {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+getCookie('token') },
                        body:JSON.stringify({sectionTitle:sec.text}),
                    };
                    try {
                        const queryParams = new URLSearchParams(window.location.search);
                        const response = await fetch(back_end_url+'/courses/'+queryParams.get("id")+'/sections/'+sec.index, requestOptions);
                        const data = await response.json();
                        if(response.status ===422){
                            swAlert("error",data.message,data.data[0]);
                        }else if(response.status ===201||response.status ===200){
                            videosManagement(sec.index);
                        }
                    } catch (error) {
                        swAlert("global");
                    }
                }
            })
        );
    }

    async function videosManagement(sectionIndex){
        await Promise.all(
            editSec[sectionIndex].videos.map(async (video,i)=>{
                const data = new FormData();
                if(video.new){
                    data.append('courseVideo',video.file);
                }
                data.append('videoTitle',video.title);
                data.append('isPreview',true);
                if(video.new){
                    const requestOptions = {
                        method: 'POST',
                        headers: {'Authorization': 'Bearer '+getCookie('token') },
                        body:data,
                    };
                    try {
                        const queryParams = new URLSearchParams(window.location.search);
                        const response = await fetch(back_end_url+'/courses/'+queryParams.get("id")+'/sections/'+sectionIndex+'/videos', requestOptions);
                        const data = await response.json();
                        if(response.status ===422){
                            swAlert("error",data.message,data.data[0]);
                        }else{
                            video.new=false;
                        }
                    } catch (error) {
                        swAlert("global");
                    }
                }else{
                    const requestOptions = {
                        method: 'PATCH',
                        headers: {'Authorization': 'Bearer '+getCookie('token') },
                        body:data,
                    };
                    try {
                        const queryParams = new URLSearchParams(window.location.search);
                        const response = await fetch(back_end_url+'/courses/'+queryParams.get("id")+'/sections/'+sectionIndex+'/videos/'+video.index, requestOptions);
                        const data = await response.json();
                        if(response.status ===422){
                            swAlert("error",data.message,data.data[0]);
                        }
                    } catch (error) {
                        swAlert("global");
                    }
                }
            })
        );
        swAlert("success","Course Data Updated Successfully");
    }
    function cobylink(link){
        navigator.clipboard.writeText(link);
        swAlert("success","Copied to clipboard");
    }
    return (
        <div className="pt-[100px]">
            <div className="flex">
                <div className="relative bg-[#F5F5F5] h-lvh min-h-screen w-[15%]">
                    <p className="text-[#000000] font-[Roboto] font-[900] italic text-center my-4 text-[1.5vw]">
                        Uploading <span className="text-[#00BF63]">Video</span>
                    </p>
                    <div className="text-center bg-[#D9D9D9] w-full py-2 text-[18px] font-[900] cursor-pointer" onClick={addSection}>
                        +
                    </div>
                    <div id="sections">
                        {editSec.map((data,index)=>(
                            <div key={index}>
                                <div className="mt-[20px] mb-[5px]" id={"section"+index}>
                                    <p className={"ml-5 font-[500] text-[1.1vw] inline"+(data.edit?' hidden':'')}
                                       id={"section"+index+"title"}>{data.text}</p>
                                    <input className={"ml-5 font-[500] text-[1.1vw] inline w-[60%]"+(data.edit?'':' hidden')}
                                           id={"section"+index+"titleedit"} defaultValue={data.text} onChange={(e)=>data.text=e.target.value} onBlur={()=>editSection(index)}/>
                                    <img src="../../src/assets/edit.png"
                                         className="ml-2 inline w-[1.1vw] relative bottom-[0.2vw] cursor-pointer"
                                         onClick={()=>editSection(index)}/>
                                </div>
                                {data.videos.map((video,ke)=>(
                                    <div className="bg-[#D9D9D9] w-full py-2 text-[18px] font-[500] cursor-pointer border-b-[1px] border-[#888888] relative" key={data+ke} onClick={()=>playVideo(index,ke)}>
                                        <img src="../../src/assets/right.png" className="ml-2 inline w-[1.1vw] relative bottom-[0.1vw]"/>
                                        <img src="../../src/assets/play_tin.png" className="mx-1 inline w-[1.3vw] relative bottom-[0.15vw]"/>
                                        <span className={(video.edit?'hidden':'')}>{ke+1}- {video.title}</span>
                                        <input className={"font-[500] text-[1.1vw] inline w-[40%] bg-[#bcbcbc] rounded-[5px]"+(video.edit?'':' hidden')} defaultValue={video.title} onChange={(e)=>video.title=e.target.value} onBlur={()=>editVideo(index,ke)}/>
                                        <img src="../../src/assets/3_dot.png" className="mx-1 inline w-[1.3vw] absolute right-[5px] top-[12px]" onClick={()=>showMenu(index,ke)}/>
                                        {video.showMenu?(
                                            <div id="dropdown" className={"z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute top-[20px] left-[100%]"}>
                                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby={"editVideoButton"+index+ke} >
                                                    <li>
                                                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white border-b-[1px] border-[#BEBEBE] text-red-700" onClick={()=>removeVideo(index,ke)}>
                                                            <img src="../../src/assets/delete_red.png" className="w-[22px] inline mr-2"/>
                                                            Delete
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <div className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white border-b-[1px] border-[#BEBEBE]" onClick={()=>editVideo(index,ke)}>
                                                            <img src="../../src/assets/rename.png" className="w-[22px] inline mr-2"/>
                                                            Rename
                                                        </div>
                                                    </li>
                                                    <li>
                                                        {!video.new?(
                                                            <div className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={()=>cobylink(back_end_domain+video.url)}>
                                                                <img src="../../src/assets/copy_link.png" className="w-[22px] inline mr-2"/>
                                                                Copy Link
                                                            </div>
                                                        ):null}
                                                    </li>
                                                </ul>
                                            </div>
                                        ):null}
                                    </div>
                                ))}
                                <div
                                    className="text-center bg-[#D9D9D9] w-full py-2 text-[18px] border-b-[1px] border-[#888888] font-[900] cursor-pointer" onClick={() => {uploadSectionId=index;open()}}>
                                    +
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
                <div className="w-[85%]">
                    <p className="font-[Roboto] font-[600] text-[#525252] text-[2vw] ml-8 mt-10">{currentTitle}</p>
                    {currentTitle!=="VIDEO TITLE"?(
                        <video className="w-[50%] aspect-video m-auto mt-[20px] pt-[8%]" id="curr-vid" controls crossOrigin="anonymous">
                            <source src="" type="video/mp4" />
                        </video>
                    ):(
                        <div className="bg-[#D9D9D9] w-[50%] aspect-video m-auto mt-[20px] pt-[8%]">
                            <img src="../../src/assets/play.png" className="w-[20%] m-auto"/>
                        </div>
                    )}
                    <div className="cursor-pointer bg-[#00BF63] py-2 text-white text-center w-[30%] my-6 m-auto rounded-[10px] font-bold text-[1.6vw]" onClick={updateCourse}>
                        COMPLETE AND Continue
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorUpload;
