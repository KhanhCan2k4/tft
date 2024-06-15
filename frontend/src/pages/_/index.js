import { Button } from "react-bootstrap";
import "./styles.css";
import { useEffect, useRef, useState } from "react";
import Footer from "../../components/Footer";
import ContactForm from "../../components/ContactForm";
import CarouselAppload from "../../components/CarouselAppload";
import { Link } from "react-router-dom";
import HaveNoClue from "./../../components/HaveNoClue/index";
import CarouselBanner from "../../components/CarouselBanner";
import { apiURL, imageURL } from "../../App";
import SildePosts, { SildePosts2 } from "../../components/SlidePosts";
import PostCard from "../../components/PostCard";
import IntroSubPage from "../Index/Intro";
import PostSubPage from "../Index/Post";
import ForumSubPage from "../Index/Forum";
import HonorSubPage from "../Index/Honor";
import HomeSubPage from "../../subpages/Home";

export default function Home() {
  //refs
  const timeId = useRef();

  //states
  const [isToRight, setToRight] = useState(true);
  const [recentPosts, setRecentPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [apploadedStudents, setApploadedStudents] = useState([]);
  const [enrollPosts, setEnrollPosts] = useState([]);
  const [forStudentPosts, setForStudentPosts] = useState([]);

  //get all nav buttons
  //get all sections
  //nav click to show section
  useEffect(() => {
    const navButtons = document.querySelectorAll(
      ".stack-home .nav-stack-header button.nav-button"
    );
    const sections = document.querySelectorAll(
      ".stack-home section.stack-section"
    );

    navButtons?.forEach((nav, index) => {
      nav?.addEventListener("click", () => {
        //unactive order
        handleUnShowAllSections();

        //toggle selection
        nav.classList.remove("active");
        nav.classList.add("active");

        //show section
        sections[index]?.classList.add("show");
      });
    });
  }, []);

  const handleUnShowAllSections = () => {
    const activeNav = document.querySelector(
      ".stack-home .nav-stack-header button.nav-button.active"
    );
    const activeSection = document.querySelector(
      ".stack-home section.stack-section.show"
    );

    activeNav?.classList.remove("active");
    activeSection?.classList.remove("show");
  };

  //fetch apploaded users
  useEffect(() => {
    setApploadedStudents([
      {
        id: 1,
        name: "Student 1",
        class: "CD22TT1",
        avatar: "",
        course: 1,
      },
      {
        id: 1,
        name: "Student 1",
        class: "CD22TT1",
        avatar: "",
        course: 1,
      },
      {
        id: 1,
        name: "Student 1",
        class: "CD22TT1",
        avatar: "",
        course: 1,
      },
      {
        id: 1,
        name: "Student 1",
        class: "CD22TT1",
        avatar: "",
        course: 1,
      },
    ]);
  }, []);

  //fetch enrollment posts from database
  useEffect(() => {
    const api = apiURL + "posts/enroll";
    fetch(api)
      .then((res) => res.json())
      .then((posts) => {
        setEnrollPosts(posts);
      })
      .catch((err) => {
        console.log("fetch enrollment: ", err);
        setEnrollPosts([]);
      });
  }, []);

  //fetch for student posts from database
  useEffect(() => {
    const api = apiURL + "posts/student";
    fetch(api)
      .then((res) => res.json())
      .then((posts) => {
        setForStudentPosts(posts);
      })
      .catch((err) => {
        console.log("fetch for student: ", err);
        setForStudentPosts([]);
      });
  }, []);

  //fetch recent posts from database
  useEffect(() => {
    const api = apiURL + "posts/recent";
    fetch(api)
      .then((res) => res.json())
      .then((posts) => {
        setRecentPosts(posts);
      })
      .catch((err) => {
        console.log("fetch recent: ", err);
        setRecentPosts([]);
      });
  }, []);

  return (
    <div className="stack-home">
      <div className="nav-stack-header">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center col-lg-2 p-3">
              <img
                onClick={handleUnShowAllSections}
                className="logo img-fluid"
                src="./src/intros/logo.png"
                alt="FIT TDC"
                title="Khoa công nghệ thông tin- Trường cao đẳng Công nghệ Thủ Đức"
              />
            </div>

            <div className="col-12 text-center py-2 mx-3 my-lg-4 col-lg">
              <Button
                value={0}
                className="px-3 py-2 nav-button"
                style={{ width: "100%", height: "100%" }}
                variant="outline-dark"
              >
                Giới thiệu
              </Button>
            </div>

            <div className="col-12 text-center py-2 mx-3 my-lg-4 col-lg">
              <Button
                className="px-3 py-2 nav-button"
                style={{ width: "100%", height: "100%" }}
                variant="outline-dark"
              >
                Bài viết
              </Button>
            </div>

            <div className="col-12 text-center py-2 mx-3 my-lg-4 col-lg">
              <Button
                className="px-3 py-2 nav-button"
                style={{ width: "100%", height: "100%" }}
                variant="outline-dark"
              >
                Cộng đồng
              </Button>
            </div>

            <div className="col-12 text-center py-2 mx-3 my-lg-4 col-lg">
              <Button
                className="px-3 py-2 nav-button"
                style={{ width: "100%", height: "100%" }}
                variant="outline-dark"
              >
                Vinh danh
              </Button>
            </div>

            <div className="col-12 text-center py-2 mx-3 my-lg-4 col-lg">
              <Button
                className="px-3 py-2 nav-button"
                style={{ width: "100%", height: "100%" }}
                variant="outline-dark"
              >
                Liên hệ
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section className="home-section">
        <HomeSubPage />
      </section>

      <section className="stack-section intro-section">
        <IntroSubPage />
      </section>

      <section className="stack-section posts-section">
        <PostSubPage />
      </section>

      <section className="stack-section forum-section">
        <ForumSubPage />
      </section>

      <section className="stack-section honor-section">
        <HonorSubPage />
      </section>

      <section className="stack-section contact-section">
        <div className="mb-3 container py-5">
          <ContactForm />
        </div>
      </section>

      <div className="bg-dark">
        <Footer />
      </div>
    </div>
  );
}
