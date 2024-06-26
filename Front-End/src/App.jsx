import "./App.css";
import {Routes, Route} from "react-router-dom";
import AuthLayout from "./components/AuthLayout";
import MainLayout from "./components/MainLayout";
import AdminLayout from "./components/AdminLayout";
import LoginPage from "./pages/LoginPage";
import StudentSignUpPage from "./pages/StudentSignUpPage";
import InstructorSignUpPage from "./pages/InstructorSignUpPage";
import VerificationPage from "./pages/VerificationPage";
import ForgotPasswordPage from "./pages/ForgetPasswordPage";
import StudentHome from "./pages/StudentHomePage";
import StudentCourseView from "./pages/StudentCourseViewPage";
import CoursesView from "./pages/CoursesViewPage";
import StudentVideoView from "./pages/StudentVideoViewPage";
import StudentRating from  "./pages/StudentRatingPage"
import StudentCourses from "./pages/StudentCoursesPage";
import InstructorHome from "./pages/InstructorHomePage";
import InstructorAuthHome from "./pages/InstructorAuthHomePage";
import InstructorCourse from "./pages/InstructorCoursePage";
import InstructorUpload from "./pages/InstructorUploadPage";


import AdminRequests from "./pages/AdminRequestsPage";
import AdminStudents from "./pages/AdminStudentsPage";
import AdminInstructors from "./pages/AdminInstructorsPage";
import AdminCourses from "./pages/AdminCoursesPage";
import AdminUserCourses from "./pages/AdminUserCoursesPage";

function App() {
    return (
        <div className="mx-auto">
            <Routes>
                {/*Home Routes*/}
                <Route path="/" element={<MainLayout/>}>
                    <Route
                        path="/"
                        element={<StudentHome/>}
                    >
                    </Route>
                    <Route
                        path="/courses"
                        element={<CoursesView/>}
                    >
                    </Route>
                    <Route
                        path="/student/course"
                        element={<StudentCourseView/>}
                    >
                    </Route>
                    <Route
                        path="/student/courses"
                        element={<StudentCourses/>}
                    >
                    </Route>
                    <Route
                        path="/student/course/view"
                        element={<StudentVideoView/>}
                    >
                    </Route>
                    <Route
                        path="/student/course/rating"
                        element={<StudentRating/>}
                    >
                    </Route>
                    <Route
                        path="/instructor"
                        element={<InstructorHome/>}
                    >
                    </Route>
                    <Route
                        path="/instructor/home"
                        element={<InstructorAuthHome/>}
                    >
                    </Route>
                    <Route
                        path="/instructor/course"
                        element={<InstructorCourse/>}
                    >
                    </Route>
                    <Route
                        path="/instructor/course/upload"
                        element={<InstructorUpload/>}
                    >
                    </Route>
                </Route>
                {/*Authentication Routes*/}
                <Route path="/" element={<AuthLayout/>}>
                    <Route
                        path="/login"
                        element={<LoginPage/>}
                    >
                    </Route>
                    <Route
                        path="/sign-up/student"
                        element={<StudentSignUpPage></StudentSignUpPage>}>
                    </Route>
                    <Route
                        path="/sign-up/instructor"
                        element={<InstructorSignUpPage></InstructorSignUpPage>}
                    ></Route>
                    <Route path="verification" element={<VerificationPage/>}></Route>
                    <Route
                        path="/forgot-password"
                        element={<ForgotPasswordPage/>}
                    ></Route>
                </Route>
                {/*Admin Routes*/}
                <Route path="/" element={<AdminLayout/>}>
                    <Route
                        path="/admin/requests"
                        element={<AdminRequests/>}
                    >
                    </Route>
                    <Route
                        path="/admin/students"
                        element={<AdminStudents/>}
                    >
                    </Route>
                    <Route
                        path="/admin/instructors"
                        element={<AdminInstructors/>}
                    >
                    </Route>
                    <Route
                        path="/admin/courses"
                        element={<AdminCourses/>}
                    >
                    </Route>
                    <Route
                        path="/admin/user-courses"
                        element={<AdminUserCourses/>}
                    >
                    </Route>
                </Route>
            </Routes>
        </div>
    )
        ;
}

export default App;
