import { Button } from "react-bootstrap";
import ContactForm from "../../components/ContactForm";
import Footer from "../../components/Footer";
import HomeSubPage from "../../subpages/Home";
import ForumSubPage from "./Forum";
import HonorSubPage from "./Honor";
import IntroSubPage from "./Intro";
import PostSubPage from "./Post";
import "./styles.css";
import { useEffect } from "react";

export default function Index() {
  //handles
  //get all nav buttons
  //get all sections
  //nav click to show section
  useEffect(() => {
    const navButtons = document.querySelectorAll(
      ".stack-index .stack-nav button.nav-button"
    );

    const sections = document.querySelectorAll(
      ".stack-index section.stack-section"
    );

    navButtons?.forEach((nav, index) => {
      nav?.addEventListener("click", () => {
        //unactive order
        handleUnShowAllSections();

        //toggle selection
        nav.classList.remove("active");
        nav.classList.add("active");

        //show section
        sections[index + 1]?.classList.add("show");
      });
    });
  }, []);

  useEffect(() => {
    document.querySelector(".stack-index .stack-nav .logo").click();
  }, []);

  const handleUnShowAllSections = () => {
    const activeNav = document.querySelector(
      ".stack-index .stack-nav button.nav-button.active"
    );
    const activeSection = document.querySelector(
      ".stack-index section.stack-section.show"
    );

    activeNav?.classList.remove("active");
    activeSection?.classList.remove("show");
  };

  const handleHome = () => {
    handleUnShowAllSections();
    document
      .querySelector(".stack-index .stack-section.home-section")
      ?.classList.remove("show");
    document
      .querySelector(".stack-index .stack-section.home-section")
      ?.classList.add("show");
  };

  return (
    <div className="stack-index">
      <div className="stack-nav fixed-top">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center col-lg-2 p-3">
              <img
                onClick={handleHome}
                className="logo img-fluid"
                src="./src/intros/logo.png"
                alt="FIT TDC"
                title="Khoa công nghệ thông tin- Trường cao đẳng Công nghệ Thủ Đức"
              />
            </div>

            <div className="col-12 text-center py-2 mx-3 my-lg-4 col-lg">
              <button
                value={0}
                className="btn px-3 py-2 nav-button"
                style={{ width: "100%", height: "100%" }}
              >
                Giới thiệu
              </button>
            </div>

            <div className="col-12 text-center py-2 mx-3 my-lg-4 col-lg">
              <button
                className=" btn px-3 py-2 nav-button"
                style={{ width: "100%", height: "100%" }}
              >
                Bài viết
              </button>
            </div>

            <div className="col-12 text-center py-2 mx-3 my-lg-4 col-lg">
              <button
                className=" btn px-3 py-2 nav-button"
                style={{ width: "100%", height: "100%" }}
              >
                Cộng đồng
              </button>
            </div>

            <div className="col-12 text-center py-2 mx-3 my-lg-4 col-lg">
              <button
                className=" btn px-3 py-2 nav-button"
                style={{ width: "100%", height: "100%" }}
              >
                Vinh danh
              </button>
            </div>

            <div className="col-12 text-center py-2 mx-3 my-lg-4 col-lg">
              <button
                className=" btn px-3 py-2 nav-button"
                style={{ width: "100%", height: "100%" }}
              >
                Liên hệ
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="intro-video">
        <video
          volume={0.5}
          autoPlay
          muted
          loop
          onLoadStart={(e) => {
            e.target.volume = 0.5;
          }}
        >
          <source src={`./src/intros/intro-2.mp4`} type="video/mp4" />
          <audio src={`./src/intros/intro-2.mp4`} autoPlay={true} />
        </video>
      </div>

      <section className="stack-section home-section">
        <HomeSubPage />
        <div className="bg-dark mt-5">
          <Footer />
        </div>
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
        <div className="mb-3 row">
          <div className="offset-2 col-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
