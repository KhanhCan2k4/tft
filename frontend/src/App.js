import { BrowserRouter, Route, Routes } from "react-router-dom"

import EnrolmentPage from "./pages/Enrolment";
import GraduationPage from "./pages/Graduation";
import PostPage from "./pages/Post";
import ApploadPage from "./pages/Appload";
import Intro from "./pages/Intro";
import ForumPage from "./pages/Forum";
import ContactPage from "./pages/Contact";
import LinkForumPage from "./pages/LinkForum";
import Home from "./pages/_";
import DetailPost from "./pages/DetailPost";
import AdminIntroIndex from "./pages/Admin/Intro/Index";
import AdminPostIndex from "./pages/Admin/Post/Index";
import AdminForumIndex from "./pages/Admin/Forum/Index";
import Login from './pages/Admin/Login/index';
import AdminContactIndex from "./pages/Admin/Contact/Index";
import Index from "./pages/Index";
import AdminContactEdit from "./pages/Admin/Contact/Edit";
import { AdminUserIndex } from "./pages/Admin/User/Index";
import AdminUserCreate from "./pages/Admin/User/Create";
import { AdminUserEdit } from "./pages/Admin/User/Edit";
import AdminPostCreate from "./pages/Admin/Post/Create";
import AdminPostEdit from "./pages/Admin/Post/Edit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/home" element={<FadeTransition><HomePage /></FadeTransition> } /> */}
        <Route path="/intro" element={<Intro />} />

        <Route path="/" element={<Index />} />

        <Route path="/tuyen-sinh" element={<EnrolmentPage />} />
        <Route path="/sinh-vien" element={<ForumPage />} />
        <Route path="/bai-viet" element={<PostPage />} />
        <Route path="/bai-viet/chi-tiet/*" element={<DetailPost />} />
        <Route path="/danh-muc" element={<GraduationPage />} />
        <Route path="/vinh-danh" element={<ApploadPage />} />
        <Route path="/lien-he" element={<ContactPage />} />
        <Route path="/cong-dong" element={<ForumPage/>} />

        <Route path="/cong-dong/link/*" element={<LinkForumPage/>} />


        {/* QUAN TRI - ADMINISTRATION */}

        <Route path="/admin" element={<AdminIntroIndex />} />

        <Route path="/admin/users" element={<AdminUserIndex />} />
        <Route path="/admin/users/create" element={<AdminUserCreate />} />
        <Route path="/admin/users/edit" element={<AdminUserEdit/>} />

        <Route path="/admin/posts" element={<AdminPostIndex />} />
        <Route path="/admin/posts/edit" element={<AdminPostEdit />} />
        <Route path="/admin/posts/create" element={<AdminPostCreate />} />


        <Route path="/admin/forums" element={<AdminForumIndex />} />


        <Route path="/admin/contacts" element={<AdminContactIndex />} />
        <Route path="/admin/contacts/edit" element={<AdminContactEdit />} />


        <Route path="/admin/login" element={<Login />} />
      </Routes>
    </BrowserRouter >
  );
}

export default App;

export const apiURL = 'http://localhost:8000/api/';
export const imageURL = 'http://localhost:8000/storage/images/';
export const public_email_key = "nbxhmGhQt4JpgZSUa";

export function slug(str) {
  return String(str)
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd') //Xóa dấu
    .trim().toLowerCase() //Cắt khoảng trắng đầu, cuối và chuyển chữ thường
    .replace(/[^a-z0-9\s-]/g, '') //Xóa ký tự đặc biệt
    .replace(/[\s-]+/g, '-') //Thay khoảng trắng bằng dấu -, ko cho 2 -- liên tục
}