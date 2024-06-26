import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDropzone} from "react-dropzone";
import {getCookie,delay,swAlert} from "../../helpers";


const InstructorAuthHome = () => {
    const [showModal, setShowModal] = React.useState(false);
    const [showConfirmModal, setShowConfirmModal] = React.useState(false);
    const [files, setFiles] = useState(false);
    const [courses,setCourses]=useState([]);
    const [dataLoaded,setDataLoaded]=useState(false);
    const back_end_url=import.meta.env.VITE_BACK_END_URL;
    const back_end_domain=import.meta.env.VITE_BACK_END_DOMAIN;

    useEffect(()=>{
        if(!getCookie('token')||JSON.parse(getCookie('user')).role!=="Instructor"){
            window.location.href="/";
        }
        const getCourses = async () => {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json','Authorization': 'Bearer '+getCookie('token') },
            };
            try {
                const response = await fetch(back_end_url+'/courses/user-courses', requestOptions);
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
    },[]);

    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            title: "",
            description: "",
            education: "",
            stage: "",
            level: "",
            language: "",
            courseAvailability: "",
            price: "",
            term: "",
            keywords: "",
            courseImage: null,
            limitedPeriod:"",
            subject:"",
        },

        validationSchema: Yup.object({
            title: Yup.string().required("Please enter course name")
                .min(3, "minimum 3 characters"),
            description: Yup.string().required("Please enter course description")
                .min(3, "minimum 3 characters"),
            education: Yup.string().required("Please enter course education"),
            stage: Yup.string().when("education",
                (education,schema)=>{
                    if(education[0] === "General" || education[0] === "Special"){
                        return schema.required('Please enter course stage');
                    }else{
                        return schema;
                    }
                }),
            level: Yup.string().when("stage",
                (stage,schema)=>{
                    if(stage[0] !== "University"){
                        return schema.required('Please enter course level');
                    }else{
                        return schema;
                    }
                }),
            price: Yup.number().required("Please enter course price")
                .min(1, "minimum price is 1"),
            courseImage: Yup.array()
                .min(1, "Please upload course image")
                .of(
                    Yup.mixed().test(
                        "fileSize",
                        "File size is too large",
                        (value) => value && value.size <= 10000000 // 10 MB
                    )
                ),
            limitedPeriod: Yup.string().when("courseAvailability",
                (courseAvailability,schema)=>{
                            if(courseAvailability[0] === "Limited"){
                                return schema.required('Limit Period is required');
                            }else{
                                return schema;
                            }
                        }),
        }),
        onSubmit: (values) => {
            const data = new FormData();
            if(values.limitedPeriod!==""){
                data.append('limitedPeriod', values.limitedPeriod);
            }
            if(values.term!==""){
                data.append('term', values.term);
            }
            if(values.subject!==""){
                data.append('subject', values.subject);
            }
            if(values.stage!==""){
                data.append('stage', values.stage);
            }
            if(values.level!==""){
                data.append('level', values.level);
            }
            data.append('courseImage',files);
            data.append('title', values.title);
            data.append('description', values.description);
            data.append('education', values.education);
            data.append('price', values.price);
            data.append('language', values.language);
            data.append('courseAvailability', values.courseAvailability);
            data.append('keywords', values.keywords);
            const requestOptions = {
                method: 'POST',
                headers: {'Authorization': 'Bearer '+getCookie('token'),},
                body: data
            };
            const createCourse = async () => {
                try {
                    const response = await fetch(back_end_url + '/courses', requestOptions);
                    const data = await response.json();
                    if (response.status === 422) {
                        swAlert("error",data.message,data.data[0]);
                    } else if (response.status === 200||response.status === 201) {
                        swAlert("success",data.message);
                        setShowModal(false);
                        setShowConfirmModal(true);
                    }

                } catch (error) {
                    swAlert("global");
                }
            };
            createCourse();
        },
    });
    const { open } = useDropzone({
        accept: "image/*", // You can change the accepted file types
        onDrop: (acceptedFiles) => {
            setFiles(acceptedFiles[0]);
            validation.setFieldValue("courseImage", acceptedFiles);
        },
    });
    return (
        <div className="pt-[100px]">
            <div className="bg-gradient-to-b w-full aspect-[8/2] from-[#D9D9D900] to-[#00BF634D] curved-bottom mb-5">
                <img src="../src/assets/inst_home.png" className="w-[25%] m-auto"/>
            </div>
            <p className="text-center my-[40px] font-bold text-[#505050] lg:text-[2.4vw] text-[22px]">Start
                Uploading <span className="text-[#00BF63]">Now !</span></p>
            <p className="lg:text-[1.5vw] text-[18px] w-[60%] m-auto font-[500]">Every step forward, no matter how
                small, is a step towards progress. Keep pushing forward ,Start uploading your courses to our platform
                and hurry to build the future !</p>
            <div className="grid grid-cols-4 mx-8">
                {dataLoaded?(
                    <>
                    {courses.map((data,i)=>(
                        <>
                        {data.status!=="Rejected"?(
                            <div className="m-auto my-[50px] w-[90%] cursor-pointer">
                                <div className="aspect-square text-center pt-[10%] font-bold">
                                    <a href={"/instructor/course?id="+data.id}>
                                        <img src={back_end_domain+data.imageUrl} crossOrigin="anonymous"/>
                                    </a>
                                </div>
                            </div>
                        ):null}
                        </>
                    ))}
                    </>
                ):null}
                <div className="m-auto my-[50px] w-[60%] cursor-pointer">
                    <div className="bg-[#D9D9D9] aspect-square text-center pt-[5%] font-bold"
                         onClick={() => setShowModal(true)}>
                        <p className="text-[8vw]">+</p>
                    </div>
                </div>
            </div>
            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto mt-[850px] mb-4 mx-auto max-w-2xl">
                            {/*content*/}
                            <div
                                className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <form onSubmit={validation.handleSubmit}>
                                    <div className="p-5">
                                        <button
                                            className="p-1 ml-auto bg-transparent border-0 text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
                                            onClick={() => setShowModal(false)}>
                                            <img src="../src/assets/arrow_left.png" className="w-[30px]"/>
                                        </button>
                                    </div>
                                    {/*body*/}
                                    <div className="relative px-6 flex-auto">
                                        <p className="font-[800] text-[18px]">Note !</p>
                                        <p className="text-[#353535CC] text-[18px] font-bold">
                                            Make the course description short and add key points .
                                        </p>
                                        <hr className="border-t-2 w-[80%] m-auto my-8"/>
                                        <label>Course Name: </label>
                                        <input className="bg-[#EEEEEE] w-[220px] h-[35px] px-4 ml-[20px] rounded-[10px]"
                                               name="title" value={validation.values.title}
                                               onChange={validation.handleChange}/>
                                        {validation.touched.title && validation.errors.title ? (
                                            <h2 className="text-red-700 mt-1" type="invalid">
                                                {validation.errors.title}
                                            </h2>
                                        ) : null}
                                        <br/>
                                        <label>Course Description: </label>
                                        <textarea className="w-full bg-[#EEEEEE] rounded-[10px] p-4 mt-2" rows="3" name="description" value={validation.values.description} onChange={validation.handleChange}></textarea>
                                        {validation.touched.description && validation.errors.description ? (
                                            <h2 className="text-red-700 mt-1" type="invalid">
                                                {validation.errors.description}
                                            </h2>
                                        ) : null}
                                        <label>Education: </label>
                                        <select className="w-full bg-[#EEEEEE] rounded-[10px] px-4 py-2 mt-2" name="education" value={validation.values.education} onChange={validation.handleChange}>
                                            <option value="">Select one</option>
                                            <option value="General">General</option>
                                            <option value="Special">Special</option>
                                            <option value="Graduated">Graduated</option>
                                        </select>
                                        {validation.touched.education && validation.errors.education ? (
                                            <h2 className="text-red-700 mt-1" type="invalid">
                                                {validation.errors.education}
                                            </h2>
                                        ) : null}
                                        {validation.values.education === "General" || validation.values.education === "Special" ? (
                                            <>
                                                <>
                                                    <label>Stage: </label>
                                                    <select name="stage" className="w-full bg-[#EEEEEE] rounded-[10px] px-4 py-2 mt-2" value={validation.values.stage} onChange={validation.handleChange}>
                                                        <option value="">Stage</option>
                                                        <option value="Primary stage">Primary stage</option>
                                                        <option value="Middle school">Middle school</option>
                                                        <option value="High school">High school</option>
                                                        <option value="University">University</option>
                                                    </select>
                                                    {validation.touched.stage && validation.errors.stage ? (
                                                        <h2 className="text-red-700 mt-1" type="invalid">
                                                            {validation.errors.stage}
                                                        </h2>
                                                    ) : null}
                                                </>
                                                {validation.values.stage !== "University" ? (
                                                    <>
                                                        <label>Level: </label>
                                                        <select name="level" className="w-full bg-[#EEEEEE] rounded-[10px] px-4 py-2 mt-2" value={validation.values.level} onChange={validation.handleChange}>
                                                            <option value="">Level</option>
                                                            <option value="Level one">Level One</option>
                                                            <option value="Level two">Level Two</option>
                                                            <option value="Level three">Level Three</option>
                                                        </select>
                                                        {validation.touched.level && validation.errors.level ? (
                                                            <h2 className="text-red-700 mt-1" type="invalid">
                                                                {validation.errors.level}
                                                            </h2>
                                                        ) : null}
                                                    </>
                                                ) : null}{" "}
                                            </>
                                        ) : null}
                                        <label>Language of course: </label>
                                        <select className="w-full bg-[#EEEEEE] rounded-[10px] px-4 py-2 mt-2" name="language" value={validation.values.language} onChange={validation.handleChange}>
                                            <option disabled selected hidden>Select one</option>
                                            <option value="">Select Language</option>
                                            <option value="Arabic">Arabic</option>
                                            <option value="English">English</option>
                                        </select>
                                        {validation.touched.language && validation.errors.language ? (
                                            <h2 className="text-red-700 mt-1" type="invalid">
                                                {validation.errors.language}
                                            </h2>
                                        ) : null}
                                        {validation.values.education === "General" && validation.values.stage !== "University" ? (
                                            <>
                                                <label>Term: </label>
                                                <select className="w-full bg-[#EEEEEE] rounded-[10px] px-4 py-2 mt-2" name="term" value={validation.values.term} onChange={validation.handleChange}>
                                                    <option value="">Select one</option>
                                                    <option value="First term">First term</option>
                                                    <option value="Second term">Second term</option>
                                                </select>
                                                {validation.touched.term && validation.errors.term ? (
                                                    <h2 className="text-red-700 mt-1" type="invalid">
                                                        {validation.errors.term}
                                                    </h2>
                                                ) : null}
                                                <label>Subject: </label>
                                                <select className="w-full bg-[#EEEEEE] rounded-[10px] px-4 py-2 mt-2" name="subject" value={validation.values.subject} onChange={validation.handleChange}>
                                                    <option value="Other">Select one</option>
                                                    <option value="Arabic">Arabic</option>
                                                    <option value="English">English</option>
                                                    <option value="Mathematics">Mathematics</option>
                                                    <option value="Science">Science</option>
                                                    <option value="Social Studies">Social Studies</option>
                                                    <option value="Computer">Computer</option>
                                                    <option value="Drawing">Drawing</option>
                                                    <option value="French">French</option>
                                                    <option value="Spanish">Spanish</option>
                                                    <option value="German">German</option>
                                                    <option value="Chemistry">Chemistry</option>
                                                    <option value="Physics">Physics</option>
                                                    <option value="Mechanics">Mechanics</option>
                                                    <option value="Biology">Biology</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                {validation.touched.subject && validation.errors.subject ? (
                                                    <h2 className="text-red-700 mt-1" type="invalid">
                                                        {validation.errors.subject}
                                                    </h2>
                                                ) : null}
                                            </>
                                            ):null}
                                        <label>Course availability after purchase :</label>
                                        <select className="w-full bg-[#EEEEEE] rounded-[10px] px-4 py-2 mt-2" name="courseAvailability" value={validation.values.courseAvailability} onChange={validation.handleChange}>
                                            <option value="">Select one</option>
                                            <option value="Limited">Limited</option>
                                            <option value="Unlimited">Unlimited</option>
                                        </select>
                                        {validation.touched.courseAvailability && validation.errors.courseAvailability ? (
                                            <h2 className="text-red-700 mt-1" type="invalid">
                                                {validation.errors.courseAvailability}
                                            </h2>
                                        ) : null}
                                        {validation.values.courseAvailability==="Limited"?(
                                            <>
                                                <label>Limited period :</label>
                                                <select className="w-full bg-[#EEEEEE] rounded-[10px] px-4 py-2 mt-2" name="limitedPeriod" value={validation.values.limitedPeriod} onChange={validation.handleChange}>
                                                    <option value="">Select one</option>
                                                    <option value="A week">A week</option>
                                                    <option value="2 weeks">2 weeks</option>
                                                    <option value="A month">A month</option>
                                                    <option value="4 months">4 months</option>
                                                    <option value="6 months">6 months</option>
                                                    <option value="8 months">8 months</option>
                                                    <option value="10 months">10 months</option>
                                                    <option value="A year">A year</option>
                                                </select>
                                                {validation.touched.limitedPeriod && validation.errors.limitedPeriod ? (
                                                    <h2 className="text-red-700 mt-1" type="invalid">
                                                        {validation.errors.limitedPeriod}
                                                    </h2>
                                                ) : null}
                                            </>
                                        ):null}
                                        <label>Keywords: </label>
                                        <input
                                            className="bg-[#EEEEEE] w-[220px] h-[35px] px-4 ml-[20px] mt-5 rounded-[10px]" name="keywords" value={validation.values.keywords} onChange={validation.handleChange}/>
                                        <br/>
                                        <label>Price: </label>
                                        <input className="bg-[#EEEEEE] w-[220px] h-[35px] px-4 ml-[20px] mt-5 rounded-[10px]" name="price" value={validation.values.price} onChange={validation.handleChange}/>
                                        {validation.touched.price && validation.errors.price ? (
                                            <h2 className="text-red-700 mt-1" type="invalid">
                                                {validation.errors.price}
                                            </h2>
                                        ) : null}
                                        <br/>
                                        <label>Add course photo: </label>
                                        <div
                                            className="bg-[#D9D9D9] text-center mt-5 w-[200px] h-[100px] m-auto font-bold cursor-pointer rounded-[10px]" onClick={() => {open();}}>
                                            <p className="text-[4vw]">{files ? "✓":"+"}</p>
                                        </div>
                                        {validation.touched.courseImage && validation.errors.courseImage && !files[0] ? (
                                            <h2 className="text-red-700 mt-1" type="invalid">
                                                {validation.errors.courseImage}
                                            </h2>
                                        ) : null}
                                    </div>
                                    <div className="p-6 rounded-b">
                                        <button
                                            className="cursor-pointer bg-[#00BF63] py-2 text-white text-center w-[100%] my-4 rounded-[10px] font-bold text-[20px]"
                                            type="submit">
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-75 fixed inset-0 z-40 bg-[#a3a3a39c]"></div>
                </>
            ) : null}
            {showConfirmModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto mt-[100px] mb-4 mx-auto max-w-xl">
                            {/*content*/}
                            <div
                                className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*body*/}
                                <div className="relative px-6 flex-auto">
                                    <img src="../src/assets/not_mark.png" className="w-[100px] m-auto mt-8"/>
                                    <p className="text-[#2A2828] font-[600] mx-4">
                                        The course data and images are being reviewed by the admin, and a response will
                                        be made within 10 to 15 minutes.
                                    </p>
                                    <p className="text-[#2A2828] font-[600] mx-4 mt-8">
                                        Note !
                                        <br/>
                                        (The appearance of the course and its information on the main page means that it
                                        has been approved) .
                                    </p>
                                </div>
                                <div className="p-6 rounded-b">
                                    <div
                                        className="cursor-pointer bg-[#00BF63] py-2 text-white text-center w-[100%] my-4 rounded-[10px] font-bold text-[20px]"
                                        onClick={() => setShowConfirmModal(false)}>
                                        Ok
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

export default InstructorAuthHome;
