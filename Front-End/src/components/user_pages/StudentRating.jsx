import React, {useEffect, useState} from "react";
import {getCookie, swAlert} from "../../helpers.jsx";

const StudentRating = () => {
    const [course,setCourse]=useState([]);
    const [dataLoaded,setDataLoaded]=useState(false);
    const back_end_url=import.meta.env.VITE_BACK_END_URL;
    const back_end_domain=import.meta.env.VITE_BACK_END_DOMAIN;
    const ai_comment_url=import.meta.env.VITE_AI_COMMENT;
    const [wstar1,setWStar1]=useState(false);
    const [wstar2,setWStar2]=useState(false);
    const [wstar3,setWStar3]=useState(false);
    const [wstar4,setWStar4]=useState(false);
    const [wstar5,setWStar5]=useState(false);

    const [star1,setStar1]=useState('star.PNG');
    const [star2,setStar2]=useState('star.PNG');
    const [star3,setStar3]=useState('star.PNG');
    const [star4,setStar4]=useState('star.PNG');
    const [star5,setStar5]=useState('star.PNG');

    const [comment,setComment]=useState('');
    const [oldReview,setOldReview]=useState(null);
    const [rating,setRating]=useState(null);

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
                    data.course.reviews.map((rev,)=>{
                       if(rev.user._id===JSON.parse(getCookie("user")).userId){
                           setOldReview(rev);
                           setComment(rev.comment);
                           selectStar(rev.rating);
                           starHover(rev.rating);
                       }
                    });
                }

            } catch (error) {
                swAlert("global");
            }
        };
        getCourse();
    },[]);


    function starHover(number){
        if(number===1){
            setStar1('star_f.PNG');
            setStar2('star.PNG');
            setStar3('star.PNG');
            setStar4('star.PNG');
            setStar5('star.PNG');
        }else if(number===2){
            setStar1('star_f.PNG');
            setStar2('star_f.PNG');
            setStar3('star.PNG');
            setStar4('star.PNG');
            setStar5('star.PNG');
        }else if(number===3){
            setStar1('star_f.PNG');
            setStar2('star_f.PNG');
            setStar3('star_f.PNG');
            setStar4('star.PNG');
            setStar5('star.PNG');
        }else if(number===4){
            setStar1('star_f.PNG');
            setStar2('star_f.PNG');
            setStar3('star_f.PNG');
            setStar4('star_f.PNG');
            setStar5('star.PNG');
        }else if(number===5){
            setStar1('star_f.PNG');
            setStar2('star_f.PNG');
            setStar3('star_f.PNG');
            setStar4('star_f.PNG');
            setStar5('star_f.PNG');
        }
    }

    function starStopHover(){
        setStar1(wstar1?'star_f.PNG':'star.PNG');
        setStar2(wstar2?'star_f.PNG':'star.PNG');
        setStar3(wstar3?'star_f.PNG':'star.PNG');
        setStar4(wstar4?'star_f.PNG':'star.PNG');
        setStar5(wstar5?'star_f.PNG':'star.PNG');
    }

    function selectStar(num){
        setRating(num);
        if(num===1){
            setWStar1(true);
            setWStar2(false);
            setWStar3(false);
            setWStar4(false);
            setWStar5(false);
        }else if(num===2){
            setWStar1(true);
            setWStar2(true);
            setWStar3(false);
            setWStar4(false);
            setWStar5(false);
        }else if(num===3){
            setWStar1(true);
            setWStar2(true);
            setWStar3(true);
            setWStar4(false);
            setWStar5(false);
        }else if(num===4){
            setWStar1(true);
            setWStar2(true);
            setWStar3(true);
            setWStar4(true);
            setWStar5(false);
        }else if(num===5){
            setWStar1(true);
            setWStar2(true);
            setWStar3(true);
            setWStar4(true);
            setWStar5(true);
        }
    }
    async function rate(){
        const data = new FormData();
        data.append('rating',rating);
        data.append('comment',comment);
        data.append('course',course._id);
        if(rating===null){
            swAlert("error","You must rate the course");
        }else{
            try {
                const requestOptions = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({comment: comment}),
                };
                const response = await fetch(ai_comment_url+'/predict', requestOptions);
                const dataAi = await response.json();
                if(response.status ===422){
                    swAlert("error",dataAi.message);
                }else if(response.status ===200 && dataAi.message==="accepted"){
                    if(oldReview){
                        const requestOptions = {
                            method: 'PATCH',
                            headers: {'Authorization': 'Bearer '+getCookie('token') },
                            body: data,
                        };
                        try {
                            const response = await fetch(back_end_url+'/reviews/'+oldReview._id, requestOptions);
                            const data = await response.json();
                            if(response.status ===422){
                                swAlert("error",data.message,data.data[0]);
                            }else if(response.status ===200){
                                swAlert("success","your review updated successfully");
                            }
                        } catch (error) {
                            swAlert("global");
                        }
                    }else{
                        const requestOptions = {
                            method: 'POST',
                            headers: {'Authorization': 'Bearer '+getCookie('token') },
                            body: data,
                        };
                        try {
                            const response = await fetch(back_end_url+'/reviews', requestOptions);
                            const data = await response.json();
                            if(response.status ===422){
                                swAlert("error",data.message,data.data[0]);
                            }else if(response.status ===201){
                                swAlert("success","your review added successfully");
                            }
                        } catch (error) {
                            swAlert("global");
                        }
                    }
                }else{
                    swAlert("error","Our AI detected spam/not acceptable comment");
                }
            } catch (error) {
                console.log(error);
                swAlert("global");
            }

        }
    }

    async function deleteComment(){
        const requestOptions = {
            method: 'DELETE',
            headers: {'Authorization': 'Bearer '+getCookie('token') },
        };
        try {
            const response = await fetch(back_end_url+'/reviews/'+oldReview._id, requestOptions);
            const data = await response.json();
            if(response.status ===422){
                swAlert("error",data.message,data.data[0]);
            }else if(response.status ===200){
                swAlert("success","your review deleted successfully");
                setRating(null);
                setComment("");
            }
        } catch (error) {
            swAlert("global");
        }
    }
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
                                     key={index+i}>
                                    <img src="../../src/assets/play_tin.png" className="mx-1 inline w-[1.3vw] relative bottom-[0.15vw]"/>
                                    <span>{i}- {vid.title+" "+vid.formattedDuration}</span>
                                </div>
                            ))}
                        </div>
                    )):null}
                    <a href={"/student/course/view?id="+course._id}>
                        <div className="w-[80%] text-[#00BF63] bg-[#EBEBEB] font-[700] py-2 text-center my-10 m-auto text-[1.3vw] rounded-[10px] cursor-pointer">
                            Back to View
                        </div>
                    </a>
                </div>
                <div className="w-[85%]">
                    <div className="my-[100px] w-[45%] m-auto">
                        <p className="text-[#00BF63] font-[700] text-[1.8vw]">Rating course</p>
                        <div className="m-auto my-4 w-[210px]">
                            <img src={"../../src/assets/"+star1} className="inline w-[40px] h-[40px] cursor-pointer" onMouseEnter={()=>starHover(1)} onMouseLeave={()=>starStopHover()} onClick={()=>selectStar(1)}/>
                            <img src={"../../src/assets/"+star2} className="inline w-[40px] h-[40px] cursor-pointer" onMouseEnter={()=>starHover(2)} onMouseLeave={()=>starStopHover()} onClick={()=>selectStar(2)}/>
                            <img src={"../../src/assets/"+star3} className="inline w-[40px] h-[40px] cursor-pointer" onMouseEnter={()=>starHover(3)} onMouseLeave={()=>starStopHover()} onClick={()=>selectStar(3)}/>
                            <img src={"../../src/assets/"+star4} className="inline w-[40px] h-[40px] cursor-pointer" onMouseEnter={()=>starHover(4)} onMouseLeave={()=>starStopHover()} onClick={()=>selectStar(4)}/>
                            <img src={"../../src/assets/"+star5} className="inline w-[40px] h-[40px] cursor-pointer" onMouseEnter={()=>starHover(5)} onMouseLeave={()=>starStopHover()} onClick={()=>selectStar(5)}/>
                        </div>
                        <div className="bg-[#D9D9D9]">
                            <p className="text-[1.1vw] font-[700] px-8 pt-4 relative">
                                Comment
                                <img src="../../src/assets/delete_red.png" title="delete comment" className="absolute right-4 w-[20px] bottom-1 cursor-pointer" onClick={deleteComment}/>
                            </p>
                            <div className="h-[100px] py-2 px-4">
                                {comment}
                            </div>
                            <hr className="border-t-[1px] w-[90%] m-auto border-[#626262]"/>
                            <input type="text" placeholder="Write a comment" className="w-[80%] bg-[#D9D9D9] my-2 ml-[5%] h-[40px] px-2" onChange={event => setComment(event.target.value)}/>
                            <img src="../../src/assets/send.png" className="inline w-[30px] ml-[5%] bottom-1 cursor-pointer" onClick={rate}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentRating;
