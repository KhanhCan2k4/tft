// libararies
import { BrowserRouter, Route, Routes } from "react-router-dom";
//user pages
import Index from "./pages/Index";
import CurriculumPage from "./pages/Index/Curriculum";
import PostPage from "./pages/Post";
import DetailPost from "./pages/DetailPost";

//admin pages
import AdminIntroIndex from "./pages/Admin/Intro/Index";
import { AdminUserIndex } from "./pages/Admin/User/Index";
import AdminUserCreate from "./pages/Admin/User/Create";
import { AdminUserEdit } from "./pages/Admin/User/Edit";
import AdminPostIndex from "./pages/Admin/Post/Index";
import AdminPostCreate from "./pages/Admin/Post/Create";
import AdminPostEdit from "./pages/Admin/Post/Edit";
import AdminForumIndex from "./pages/Admin/Forum/Index";
import AdminContactIndex from "./pages/Admin/Contact/Index";
import AdminContactEdit from "./pages/Admin/Contact/Edit";
import AdminCurriculumIndex from "./pages/Admin/Curriculum/Index";
import Login from "./pages/Admin/Login/index";
import AdminConfigIndex from "./pages/Admin/Configuration/Index";
import AdminForumEdit from "./pages/Admin/Forum/Edit";
import ForumPage from "./pages/Forum";
import { createContext, useEffect, useState } from "react";

export const ConfigContext = createContext([]);

function App() {
  const [configs, setConfigs] = useState([]);

  useEffect(() => {
    const api = apiURL + "configs";

    fetch(api)
      .then((res) => res.json())
      .then((configs) => {
        setConfigs(configs);
      });
  }, []);

  return (
    <ConfigContext.Provider value={configs}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/chuong-trinh-dao-tao" element={<CurriculumPage />} />
          <Route path="/bai-viet" element={<PostPage />} />
          <Route path="/bai-viet/chi-tiet/*" element={<DetailPost />} />

          <Route path="/cong-dong" element={<ForumPage />} />

          {/* QUAN TRI - ADMINISTRATION */}
          <Route path="/admin" element={<AdminIntroIndex />} />

          <Route path="/admin/users" element={<AdminUserIndex />} />
          <Route path="/admin/users/create" element={<AdminUserCreate />} />
          <Route path="/admin/users/edit" element={<AdminUserEdit />} />

          <Route path="/admin/posts" element={<AdminPostIndex />} />
          <Route path="/admin/posts/create" element={<AdminPostCreate />} />
          <Route path="/admin/posts/edit" element={<AdminPostEdit />} />

          <Route path="/admin/forum" element={<AdminForumIndex />} />
          <Route path="/admin/forum/edit" element={<AdminForumEdit />} />

          <Route path="/admin/contacts" element={<AdminContactIndex />} />
          <Route path="/admin/contacts/edit" element={<AdminContactEdit />} />

          <Route path="/admin/curriculums" element={<AdminCurriculumIndex />} />
          <Route
            path="/admin/curriculums/edit"
            element={<AdminCurriculumIndex />}
          />

          <Route path="/admin/configs" element={<AdminConfigIndex />} />
          <Route
            path="/admin/configs/edit"
            element={<AdminCurriculumIndex />}
          />

          <Route path="/admin/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </ConfigContext.Provider>
  );
}

export default App;

export const apiURL = "http://localhost:8000/api/";
export const imageURL = "http://localhost:8000/storage/images/";
export const fileURL = "http://localhost:8000/storage/files/";
export const public_email_key = "nbxhmGhQt4JpgZSUa";
export const gemini_api_key = "AIzaSyClTYHK29W2PU7peWSlfBu7L5m7Z8pXOhk";
export const editor_api_key =
  "8gjew3xfjqt5cu2flsa3nz2oqr4z5bru9hr3phl05rsfyss3";

export function slug(str) {
  return String(str)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d") //Xóa dấu
    .trim()
    .toLowerCase() //Cắt khoảng trắng đầu, cuối và chuyển chữ thường
    .replace(/[^a-z0-9\s-]/g, "") //Xóa ký tự đặc biệt
    .replace(/[\s-]+/g, "-"); //Thay khoảng trắng bằng dấu -, ko cho 2 -- liên tục
}

export function getCourse(_class) {
  const _c = +_class.substring(2, 4);
  return _c - 18 >= 1 ? _c - 18 : "Unknown";
}

export function getDate(date) {
  const year = +date.substring(0, 4);
  const month = +date.substring(5, 7);
  const day = +date.substring(8, 10);
  const hour = +date.substring(11, 13);
  const minute = +date.substring(14, 16);

  return `Lúc ${
    hour + 7 >= 24 ? hour + 7 - 24 : hour + 7
  }:${minute} ngày ${day}, tháng ${month}, năm ${year}`;
}

export function getShortDate(date) {
  const year = +date.substring(0, 4);
  const month = +date.substring(5, 7);
  const day = +date.substring(8, 10);
  const hour = +date.substring(11, 13);
  const minute = +date.substring(14, 16);

  return `${
    hour + 7 >= 24 ? hour + 7 - 24 : hour + 7
  }:${minute} ${day}/${month}/${year}`;
}

export const TFT_LIKED_POSTS = "TFT_LIKED_POSTS";
export const TFT_COMMENTS_THREATS = "TFT_COMMENTS_THREATS";
export const TFT_THREATS = "TFT_THREATS";
