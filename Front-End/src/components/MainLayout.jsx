import { Outlet } from "react-router-dom";
import LogoTin from "../assets/logoTin.png";
import EduFlex from "../assets/EduFlex.png";
import logoLogin from "../assets/logoLogin.png";
import xLogo from "../assets/x_logo.png";
import arrowUp from "../assets/arrow_up.png";
import faceLogo from "../assets/Facebook_logo.png";
import instaLogo from "../assets/insta_logo.png";
import default_user from "../assets/users/default_user.png";
import threeLines from "../assets/three_lines.png";
import user from "../assets/user.png";
import play from "../assets/play_green.png";
import gear from "../assets/gear.png";
import React, { useState } from 'react';

const MainLayout = () => {
    const pathname = window.location.pathname;
    function topFunction() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }
    const [scrol, setScrol] = useState("hidden");
    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            setScrol("block");
        } else {
            setScrol("hidden");
        }
    }
    window.onscroll = function() {scrollFunction()};
    let auth=false;
    if((pathname!=="/")&&(pathname!=="/instructor")){
        auth=true;
    }
    let [rightMenu,setRightMenu]=useState(false);
    function rightMenuToggle(){
        if(rightMenu){
            setRightMenu(false);
        }else{
            setRightMenu(true);
        }
    }
    const [showAccountModal, setShowAccountModal] = React.useState(false);
    function editProfile(){
        let disabled_elements=document.getElementsByClassName("disabled_element");
        let edit_btn=document.getElementById("edit-btn");
        let save_btn=document.getElementById("save-btn");
        for(let i=0;i<disabled_elements.length;i++){
            disabled_elements[i].disabled=false;
        }
        edit_btn.hidden=true;
        save_btn.hidden=false;
    }
    function editProfileBack(){
        let disabled_elements=document.getElementsByClassName("disabled_element");
        let edit_btn=document.getElementById("edit-btn");
        let save_btn=document.getElementById("save-btn");
        for(let i=0;i<disabled_elements.length;i++){
            disabled_elements[i].disabled=true;
        }
        edit_btn.hidden=false;
        save_btn.hidden=true;
    }
    return (
    <div>
        { auth ?(
            <div className="bg-gray-200 w-full fixed flex z-50" id="header">
                <div className="flex w-[25%]">
                    <img src={default_user} className="w-[60px] my-6 ml-[30%]"/>
                    <div className="font-[700] text-[#263238] my-[40px] ml-[5px]">HI, MOHAND</div>
                </div>
                <div className="w-[50%]">
                    <img src={logoLogin} className="w-[200px] h-[80px] m-auto mt-[12px]"/>
                </div>
                <div className="w-[25%]">
                    <img src={threeLines} className="w-[50px] h-[40px] ml-[60%] mt-[30px] cursor-pointer" onClick={rightMenuToggle}/>
                </div>
            </div>
        ):(
            <div className="bg-gray-200 w-full fixed flex z-50" id="header">
                <img src={LogoTin} className="md:w-[80px] md:h-[80px] w-[50px] h-[50px] md:ml-[50px] ml-[10px] md:my-2 my-4"/>
                <img src={EduFlex} className="md:w-[180px] md:h-[60px] w-[100px] h-[30px] ml-2 md:my-5 my-6"/>
                <ul className="lg:ml-[20%] md:ml-[12%]">
                    <li className="nav-li pt-[30px] sm:px-[15px] px-2 lg:text-[1.15vw] text-[12px]"><a href="/" className={(pathname==="/"?"nav-selected":"")}>STUDENT</a></li>
                    <li className="nav-li pt-[30px] sm:px-[15px] px-2 lg:text-[1.15vw] text-[12px]"><a href="/instructor" className={(pathname==="/instructor"?"nav-selected":"")}>INSTRUCTOR</a></li>
                </ul>
                <div className="absolute right-[5%]">
                    <a href="/login" className="bg-[#00BF63] text-white text-base md:py-1 sm:px-10 px-4 mt-2 rounded-xl w-full  opacity-100 block">Log In</a>
                    <a href={(pathname==="/instructor"?'/sign-up/instructor':'/sign-up/student')} className="bg-[#00BF63] text-white md:py-1 my-2 sm:px-10 px-4 text-base rounded-xl w-full  opacity-100 block">Sign Up</a>
                </div>
            </div>
        )}
        <Outlet />
        <div id="footer">
            <div className="bg-[#F5F5F5] grid grid-cols-3 py-5 gap-2">
                <div>
                    <p className="font-bold mx-[25%] sm:text-[1.7vw] text-[10px]">Follow us through</p>
                    <p className="mx-[25%] sm:mt-8 mt-4 sm:text-[1.2vw] text-[8px]">social media for the latest updates and to say connected</p>
                    <div className="w-[70%] mx-[30%] mt-8">
                        <img src={xLogo} className="w-[20%] max-w-[35px] inline cursor-pointer hover:opacity-50"/>
                        <img src={faceLogo} className="w-[22%] max-w-[35px] ml-[20px] inline cursor-pointer hover:opacity-50"/>
                        <img src={instaLogo} className="w-[22%] max-w-[35px] ml-[20px] inline cursor-pointer hover:opacity-50"/>
                    </div>
                </div>
                <div>
                    <p className="font-bold mx-[25%] sm:text-[1.7vw] text-[10px]">Links</p>
                    <p className="mx-[15%] sm:mt-8 mt-4 sm:text-[1.2vw] text-[8px]">Link:###############</p>
                    <p className="mx-[15%] sm:text-[1.2vw] text-[8px]">Link:###############</p>
                    <p className="mx-[15%] sm:text-[1.2vw] text-[8px]">Link:###############</p>
                </div>
                <div>
                    <img src={LogoTin} className="w-[50%] border-[#BABABA] min-w-[120px] border-l-2 pl-[50px]"/>
                </div>
            </div>
            <div className="bg-[#515151]">
                <p className="text-center text-white font-bold text-[22px] py-3">Made with love by teamwork eduflex &copy; 2024</p>
            </div>
        </div>
        <div className={`fixed right-[20px] bottom-[40px] bg-[#00BF63] px-4 py-3 rounded-full cursor-pointer ${scrol}`} onClick={topFunction}>
            <img src={arrowUp} className="w-[20px]"/>
        </div>
        {/*Right Menu*/}
        <div className={"right-[-30px] top-[0] h-screen w-[25%] bg-[#E5E5E6] z-[51] rounded-l-lg "+(rightMenu?'fixed':'hidden')}>
            <img src={threeLines} className="w-[50px] h-[40px] ml-[50%] mt-[30px] cursor-pointer" onClick={rightMenuToggle}/>
            <img src={LogoTin} className="w-[100px] mt-[20px] m-auto"/>
            <div className="bg-[#D9D9D9] border-b-[1px] border-[#96A09B] mt-5 px-10 py-2 cursor-pointer text-[18px] font-[500]" onClick={() => setShowAccountModal(true)}>
                <img src={user} className="inline w-[30px] mr-2"/>
                My Account
            </div>
            <a href="/student/courses">
                <div className="bg-[#D9D9D9] border-b-[1px] border-[#96A09B] px-10 py-2 cursor-pointer text-[18px] font-[500]">
                    <img src={play} className="inline w-[30px] mr-2"/>
                    My Courses
                </div>
            </a>
            <div className="bg-[#D9D9D9] px-10 py-2 cursor-pointer text-[18px] font-[500]">
                <img src={gear} className="inline w-[30px] mr-2"/>
                Settings
            </div>
            <div className="text-[#E31818] text-center cursor-pointer mt-[50px] font-[600] text-[20px]">
                Logout
            </div>
        </div>
        {showAccountModal ? (
            <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-auto mt-[100px] mb-4 mx-auto max-w-xl">
                        {/*content*/}
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/*body*/}
                            <div className="relative px-6 flex-auto">
                                <img src={default_user} className="mt-4 w-[80px] m-auto"/>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="font-[500]">First Name</label>
                                        <input className="bg-[#EEEEEE] w-full h-[40px] px-4 rounded-[10px] mb-2 disabled_element" placeholder="Mo***" disabled/>
                                    </div>
                                    <div>
                                        <label className="font-[500]">Last Name</label>
                                        <input className="bg-[#EEEEEE] w-full h-[40px] px-4 rounded-[10px] mb-2 disabled_element" placeholder="Al***" disabled/>
                                    </div>
                                </div>
                                <label className="font-[500]">email address</label>
                                <input className="bg-[#EEEEEE] w-full h-[40px] px-4 rounded-[10px] disabled_element" placeholder="mo****@gmail.com" disabled/>
                                <br/>
                                <label className="font-[500]">Password</label>
                                <input className="bg-[#EEEEEE] w-full h-[40px] px-4 rounded-[10px] disabled_element" placeholder="******" disabled/>
                                <p className="text-[14px] text-[#50505080] underline cursor-pointer">Change password</p>
                                <label>Education: </label>
                                <select className="w-full bg-[#EEEEEE] rounded-[10px] px-4 py-2 mt-2 disabled_element" disabled>
                                    <option disabled selected hidden>Select one</option>
                                    <option>General</option>
                                    <option>Special</option>
                                    <option>Graduated</option>
                                </select>
                                <label>Stage: </label>
                                <select className="w-full bg-[#EEEEEE] rounded-[10px] px-4 py-2 mt-2 disabled_element" disabled>
                                    <option disabled selected hidden>Select one</option>
                                    <option>Primary stage</option>
                                    <option>Middle school</option>
                                    <option>High school</option>
                                    <option>University</option>
                                </select>
                                <label>Level: </label>
                                <select className="w-full bg-[#EEEEEE] rounded-[10px] px-4 py-2 mt-2 disabled_element" disabled>
                                    <option disabled selected hidden>Select one</option>
                                    <option>Level One</option>
                                    <option>Level Two</option>
                                    <option>Level Three</option>
                                </select>
                            </div>
                            <div className="p-6 rounded-b" id="edit-btn">
                                <div className="cursor-pointer bg-[#00BF63] py-2 text-white text-center w-[100%] my-4 rounded-[10px] font-bold text-[20px]" onClick={()=>editProfile()}>
                                    Edit
                                </div>
                                <div className="cursor-pointer bg-[#C1C1C1] py-2 text-white text-center w-[100%] my-4 rounded-[10px] font-bold text-[20px]" onClick={()=>setShowAccountModal(false)}>
                                    Cancel
                                </div>
                            </div>
                            <div className="p-6 rounded-b" id="save-btn" hidden>
                                <div className="cursor-pointer bg-[#00BF63] py-2 text-white text-center w-[100%] my-4 rounded-[10px] font-bold text-[20px]" onClick={()=>editProfile()}>
                                    Save
                                </div>
                                <div className="cursor-pointer bg-[#F76060] py-2 text-white text-center w-[100%] my-4 rounded-[10px] font-bold text-[20px]" onClick={()=>editProfileBack()}>
                                    Revert
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

export default MainLayout;
