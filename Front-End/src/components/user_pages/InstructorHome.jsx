import React from "react";
import {Link} from "react-router-dom";

const InstructorHome = () => {

    return (
        <div className="pt-[100px]">
            <div className="mt-[2%] text-center text-[#00BF63] font-bold lg:text-[2vw] text-[22px]">Join the most
                famous and powerful teachers
            </div>
            <div className="text-center w-[80%] m-auto font-[700] text-[#505050]">
                Forget fatigue and transportation! If you are a teacher, explain the curriculum to your students in a
                fun and smart way while you are on your couch, and give them ready-made assignments with the click of a
                button... for free and for the first time in Egypt!
            </div>
            <div className="bg-gradient-to-b w-full aspect-[8/2] from-[#D9D9D900] to-[#00BF634D] curved-bottom mb-5"></div>
            <a href="/sign-up/instructor" className="bg-[#00BF63] text-white text-base py-2 px-10 mt-1 rounded-xl w-[180px] m-auto opacity-100 block">Register Now</a>
            <p className="text-center my-[40px] font-bold text-[#505050] lg:text-[1.5vw] text-[20px]">So many reasons to start</p>
            <div className="mx-[10%] grid grid-cols-3 gap-6 mb-[30px]">
                <div>
                    <img src="src/assets/inst_1.PNG" className="w-[90%]"/>
                    <p className="text-center text-[2vw] font-bold">Teach your way </p>
                    <p className="text-center text-[1.25vw] mt-[18px] font-bold">Publish the course you want, in the way you want, and always have control of your own content</p>
                </div>
                <div>
                    <img src="src/assets/inst_2.PNG" className="m-auto w-[70%]"/>
                    <p className="text-center text-[2vw] font-bold">Inspire learners</p>
                    <p className="text-center text-[1.25vw] mt-[18px] font-bold">Teach what you know and help learners explore
                        their interests, gain new skills, and advance
                        their careers</p>
                </div>
                <div>
                    <img src="src/assets/inst_3.PNG" className="m-auto w-[70%]"/>
                    <p className="text-center text-[2vw] font-bold">Get rewarded</p>
                    <p className="text-center text-[1.25vw] mt-[18px] font-bold">Expand your professional network, build your
                        expertise, and earn money on each paid
                        enrollment</p>
                </div>
            </div>
            <div className="bg-[#00BF63] h-200 grid grid-cols-4 text-center text-white font-bold text-[2vw] py-4">
                <div>11M<br/>STUDENTS</div>
                <div>100+<br/> INSTRUCTOR</div>
                <div>500<br/> ENROLLMENTS</div>
                <div>20+<br/> COUNTRIES</div>
            </div>
            <div className="mx-[15%]">
                <img src="src/assets/inst_back1.PNG" className="w-full"/>
                <hr className="border-t-[2px] border-[#00000080]"/>
                <img src="src/assets/inst_back2.PNG" className="w-full"/>
                <hr className="border-t-[2px] border-[#00000080]"/>
                <div className="mt-[60px] mb-[30px] w-[35%] h-[16px] m-auto bg-gradient-to-r from-[#D9D9D900] to-[#00BF63] rounded-[20px]"></div>
                <p className="text-center text-[#3A3A3A] font-bold lg:text-[1.5vw] text-[16px]">Virtual (electronic) classes with all the tools you need!</p>
                <p className="w-[70%] m-auto mt-5 font-[700] text-[#505050]">You can use all the tools in the simplest ways... explain and interact with your students while at home!</p>
                <img src="src/assets/inst_back4.PNG" className="aspect-[5/3] w-full bg-[#D9D9D9] rounded-[40px] mt-[40px] mb-[60px]"/>
                <hr className="border-t-[2px] border-[#00000080]"/>
                <img src="src/assets/inst_back3.PNG" className="w-full mt-[60px] mb-[100px]"/>
                <hr className="border-t-[2px] border-[#00000080]"/>
                <p className="text-center md:text-[2.25vw] text-[20px] font-bold mb-4">Top rated instructors</p>
                <hr className="border-t-[8px] border-[#00BF63] m-auto min-w-[150px] w-[25%]"/>
                <div className="my-10">
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <img src="src/assets/doctors/1.jpg" className="w-[250px] rounded-[30px]"/>
                            <p className="text-center mt-2">DR:Nada</p>
                        </div>
                        <div>
                            <img src="src/assets/doctors/2.jpg" className="w-[250px] rounded-[30px]"/>
                            <p className="text-center mt-2">DR:Yara</p>
                        </div>
                        <div>
                            <img src="src/assets/doctors/3.jpg" className="w-[250px] rounded-[30px]"/>
                            <p className="text-center mt-2">DR:Mohaned</p>
                        </div>
                        <div>
                            <img src="src/assets/doctors/4.jpg" className="w-[250px] rounded-[30px]"/>
                            <p className="text-center mt-2">DR:Hassan</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 m-auto mt-5 w-[70%]">
                        <div>
                            <img src="src/assets/doctors/5.jpg" className="w-[250px] rounded-[30px]"/>
                            <p className="text-center mt-2">DR:Alaa</p>
                        </div>
                        <div>
                            <img src="src/assets/doctors/6.jpg" className="w-[250px] rounded-[30px]"/>
                            <p className="text-center mt-2">DR:Nabil</p>
                        </div>
                        <div>
                            <img src="src/assets/doctors/7.jpg" className="w-[250px] rounded-[30px]"/>
                            <p className="text-center mt-2">DR:Rehab</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 m-auto mt-5 w-[40%]">
                        <div>
                            <img src="src/assets/doctors/8.jpg" className="w-[250px] rounded-[30px]"/>
                            <p className="text-center mt-2">DR:Ahmed</p>
                        </div>
                        <div>
                            <img src="src/assets/doctors/9.jpg" className="w-[250px] rounded-[30px]"/>
                            <p className="text-center mt-2">DR:Nadia</p>
                        </div>
                    </div>
                    <div className="m-auto mt-5 w-[20%] cursor-pointer">
                        <Link to="/sign-up/instructor">
                            <div className="bg-[#D9D9D9] aspect-square rounded-[30px] text-center pt-[15%] text-[2.25vw] font-bold">
                                <p className="text-[4vw]">+</p>
                                <p>JOIN</p>
                        </div>
                        </Link>

                    </div>
                </div>
                <hr className="border-t-[2px] border-[#00000080]"/>
            </div>
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

export default InstructorHome;
