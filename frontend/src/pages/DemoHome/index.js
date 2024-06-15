import { Link } from "react-router-dom";
import "./styles.css";
import { useEffect, useRef, useState } from "react";
import CarouselAppload from "../../components/CarouselAppload";
import Footer from "../../components/Footer";
import CarouselBanner from "../../components/CarouselBanner";
import SildePosts, { SildePosts2 } from "../../components/SlidePosts";
import ContactForm from "../../components/ContactForm";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import PostCard from "../../components/PostCard";
import { apiURL } from "../../App";
import HaveNoClue from "../../components/HaveNoClue";

const initBanner = {
  img: "banner.jpg",
  title: "Trường Cao đẳng Công nghệ Thủ Đức",
};

const types = ["logo logo-vn", "logo logo-ja", "logo-tdc", "overlay"];

const posts = [
  {
    id: 1,
    title: "Posts 1",
    content: "Posts in the database",
    image: "banners/banner-2.jpg",
    views: 0,
    likes: 0,
    created_at: "12/12/2015",
  },
  {
    id: 2,
    title: "Posts 2",
    content: "Posts in the database",
    views: 10,
    likes: 20,
    image: "banners/banner-3.jpg",
    created_at: "12/12/2015",
  },
  {
    id: 3,
    title: "Posts 3",
    content: "Posts in the database",
    views: 0,
    likes: 20,
    image: "banners/banner-4.jpg",
    created_at: "12/12/2015",
  },
  {
    id: 4,
    title: "Posts 4",
    content: "Posts in the database",
    views: 0,
    likes: 0,
    created_at: "12/12/2015",
  },
  {
    id: 5,
    title: "Posts 5",
    content: "Posts a article in the database",
    image: "banners/banner-2.jpg",
    views: 0,
    likes: 0,
    created_at: "12/12/2015",
  },
  {
    id: 6,
    title: "Posts ahihi 6",
    content: "Posts in the database",
    views: 10,
    likes: 20,
    image: "banners/banner-3.jpg",
    created_at: "12/12/2015",
  },
  {
    id: 7,
    title: "Posts 12345 7",
    content: "Posts in the database",
    views: 0,
    likes: 20,
    image: "banners/banner-4.jpg",
    created_at: "12/12/2015",
  },
  {
    id: 8,
    title: "Posts wrokmmh 8",
    content: "Posts in the database",
    views: 0,
    likes: 0,
    created_at: "12/12/2015",
  },
];

export default function DemoHome() {
  const [banners, setBanners] = useState([initBanner]);
  const [prevNavLink, setPrevNavLink] = useState();

  const banner = useRef();
  const postsRef = useRef();

  const [isToRight, setToRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [activePosts, setActivePosts] = useState();

  const [enrollPosts, setEnrollPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [forStudentPosts, setForStudentPosts] = useState([]);
  const [apploadedStudents, setApploadedStudents] = useState([]);

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

  //fetch appload studens from database
  useEffect(() => {
    const api = apiURL + "users/appload";
    fetch(api)
      .then((res) => res.json())
      .then((students) => {
        setApploadedStudents(students);
      })
      .catch((err) => {
        console.log("fetch appload: ", err);
        setApploadedStudents([]);
      });
  }, []);

  //fetch banners
  useEffect(() => {
    //fetch
    fetch(`http://localhost:8000/api/banners`)
      .then((res) => res.json())
      .then((banners) => {
        setBanners(banners);
      })
      .catch((err) => {
        console.log(err);
        setBanners([initBanner]);
      });
  }, []);

  useEffect(() => {
    const myActivePosts =
      recentPosts &&
      recentPosts.map((post) => (
        <div className="col-md-4">
          <PostCard post={post} />
        </div>
      ));

    setActivePosts(myActivePosts);
  }, []);

  useEffect(() => {
    if (recentPosts.length > 3) {
      setTimeout(function loadMore(cI, iR) {
        console.log(cI, iR);

        if (cI == undefined) {
          cI = currentIndex;
        }

        if (iR == undefined) {
          iR = isToRight;
        }

        let cIndex = iR ? cI + 1 : cI - 1;
        let isToLeft = !iR;

        if (cIndex >= posts.length - 3) {
          isToLeft = true;
        }

        if (cIndex <= 0) {
          isToLeft = false;
        }

        document.querySelectorAll(".post-card")?.forEach((card) => {
          card?.classList.remove("go");
          card?.classList.add("go");
        });

        setTimeout(() => loadMore(cIndex, !isToLeft), 5000);

        setCurrentIndex(cIndex);
        setToRight(!isToLeft);
      }, 5000);
    }
  }, []);

  useEffect(() => {
    let timeId = setTimeout(function bubble() {
      const b = document.createElement("div");
      b.className = "bubble " + types[Math.floor(Math.random() * types.length)];

      b.style.left = `${Math.round(Math.random() * 100)}%`;

      const size = Math.round(Math.random() * 90) + 10;

      b.style.width = size + "px";
      b.style.height = size + "px";

      // document.querySelector(".footer-container")?.appendChild(b);

      timeId = setTimeout(bubble, 1500);

      setTimeout(() => {
        b.remove();
      }, 5000);
    }, 1500);
  }, []);

  const handleNavLink = (e) => {
    if (prevNavLink) {
      prevNavLink.classList.remove("active");
    }

    e.target.classList.remove("active");
    e.target.classList.add("active");

    setPrevNavLink(e.target);
  };

  const homePageItem = (
    // {/* MARK:HOME */}
    <>
      <div className="stack-wave first">
        <div className="waveWrapper waveAnimation">
          <div className="waveWrapperInner bgTop">
            <div
              className="wave waveTop"
              style={{
                backgroundImage:
                  "url('http://front-end-noobs.com/jecko/img/wave-top.png')",
              }}
            ></div>
          </div>
          <div className="waveWrapperInner bgMiddle">
            <div
              className="wave waveMiddle"
              style={{
                backgroundImage:
                  "url('http://front-end-noobs.com/jecko/img/wave-mid.png')",
              }}
            ></div>
          </div>
          <div className="waveWrapperInner bgBottom">
            <div
              className="wave waveBottom"
              style={{
                backgroundImage:
                  "url('http://front-end-noobs.com/jecko/img/wave-bot.png')",
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="stack-container">
        <div className="item-page" id="trang-chu">
          <div className="page-content">
            <div className="row mt-5">
              <div className="col-md-6">
                <div className="banner">
                  <CarouselBanner banners={banners} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="home-intro">
                  <h3 className="title">
                    <span>Chương trình</span>
                    <br />
                    <b>
                      "CNTT theo mô hình gắn kết với doanh nghiệp &amp; trường
                      cao đẳng Nhật Bản"
                    </b>
                  </h3>
                </div>
                <h6 className="text pb-3 ps-4">
                  Chương trình đào tạo ngành Công nghệ thông tin theo mô hình
                  gắn kết với doanh nghiệp và trường cao đẳng Nhật Bản (gọi tắt
                  là Chương trình IT-TFT) là chương trình được xây dựng trên cơ
                  sở tiếp cận mô hình KOSEN của Nhật Bản, kết hợp chương trình
                  đào tạo của Trường Cao đẳng Công nghệ Thủ Đức (TDC) và Trường
                  Cao đẳng Công nghệ Công nghiệp Tokyo - Nhật Bản (Tokyo
                  Metropolitan College of Industrial Technology - TMCIT), với sự
                  hợp tác và hỗ trợ từ Tập đoàn Freesia - Nhật Bản.
                </h6>
                <Link to={"/gioi-thieu"} className="btn-view">
                  Tìm hiểu thêm
                </Link>
              </div>
              <div className="col-12 mt-5 ">
                <div className="row sub-contain">
                  <div className="col sub-item">
                    <span className="px-5 py-3">
                      Hỗ trợ
                      <br />
                      <b>¥5000/tháng</b>
                    </span>
                  </div>
                  <div className="col sub-item">
                    <span className="px-5 py-3">
                      Miễn phí
                      <br />
                      <b>600 giờ học tiếng Nhật</b>
                    </span>
                  </div>
                  <div className="col sub-item">
                    <span className="px-5 py-3">
                      Chỉ tiêu
                      <br />
                      <b>30 sinh viên/khoá</b>
                    </span>
                  </div>
                  <div className="col sub-item reverse">
                    <span className="px-5 py-3">
                      Đảm bảo
                      <br />
                      <b>100% có việc làm</b>
                    </span>
                  </div>
                  <div className="col sub-item reverse">
                    <span className="px-5 py-3">
                      Đào tạo
                      <br />
                      <b>Thời gian đào tạo 3 năm</b>
                    </span>
                  </div>
                  <div className="col sub-item reverse">
                    <span className="px-5 py-3">
                      Cam kết
                      <br />
                      <b>Làm việc 3 năm tại Nhật</b>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    // {/* END:HOME */}
  );
  const enrollmentPageItem = (
    // {/* MARK:ENROLLMENT */}
    <>
      <div className="stack-container  post-list">
        <div className="item-page mb-0" id="tuyen-sinh">
          {(enrollPosts && (
            <SildePosts
              posts={enrollPosts}
              title={{
                header: "Tuyển sinh",
                body: "Sinh viên khoá 6 ngành CNTT TFT",
                footer: "Ngành CNTT liên kết với doanh nghiệp Nhật Bản",
                link: "tuyen-sinh",
              }}
            />
          )) || <HaveNoClue />}
        </div>
      </div>
      {/* END:ENROLLMENT */}
    </>
  );

  const studentPageItem = (
    // {/* MARK:FOR STUDENT  */}
    <>
      <div className="stack-container post-list">
        <div className="item-page mb-0" id="sinh-vien">
          <SildePosts2
            posts={forStudentPosts}
            title={{
              header: "Cộng đồng",
              body: "Cộng đồng sinh viên CNTT TFT các khoá",
              footer: "Học sinh, sinh viên Hỏi đáp thắc mắc",
              link: "sinh-vien",
            }}
          />
        </div>
      </div>
    </>
    // {/* END:FOR STUDENT */}
  );

  const apploadPageItem = (
    <>
      {/* MARK:APPLOAD */}
      <div className="stack-wave first">
        <div className="waveWrapper waveAnimation">
          <div className="waveWrapperInner bgTop">
            <div
              className="wave waveTop"
              style={{
                backgroundImage:
                  "url('http://front-end-noobs.com/jecko/img/wave-top.png')",
              }}
            ></div>
          </div>
          <div className="waveWrapperInner bgMiddle">
            <div
              className="wave waveMiddle"
              style={{
                backgroundImage:
                  "url('http://front-end-noobs.com/jecko/img/wave-mid.png')",
              }}
            ></div>
          </div>
          <div className="waveWrapperInner bgBottom">
            <div
              className="wave waveBottom"
              style={{
                backgroundImage:
                  "url('http://front-end-noobs.com/jecko/img/wave-bot.png')",
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="stack-container">
        <div className="item-page" id="vinh-danh">
          {(apploadedStudents && apploadedStudents.length > 0 && (
            <div className="page-content">
              <div className="appload-student">
                <CarouselAppload students={apploadedStudents} />
              </div>
              <Link className="btn-view" to={"/vinh-danh"}>
                Xem chi tiết
              </Link>
            </div>
          )) || <HaveNoClue />}
        </div>
      </div>
      {/* END:APPLOAD */}
    </>
  );

  const contactPageItem = (
    <>
      {/* MARK:FOOTER & CONTACT */}
      <div className="stack-wave">
        <div className="waveWrapper waveAnimation">
          <div className="waveWrapperInner bgTop">
            <div
              className="wave waveTop"
              style={{
                backgroundImage:
                  "url('http://front-end-noobs.com/jecko/img/wave-top.png')",
              }}
            ></div>
          </div>
          <div className="waveWrapperInner bgMiddle">
            <div
              className="wave waveMiddle"
              style={{
                backgroundImage:
                  "url('http://front-end-noobs.com/jecko/img/wave-mid.png')",
              }}
            ></div>
          </div>
          <div className="waveWrapperInner bgBottom">
            <div
              className="wave waveBottom"
              style={{
                backgroundImage:
                  "url('http://front-end-noobs.com/jecko/img/wave-bot.png')",
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="footer-container stack-container py-5">
        <div className="mb-3 container py-5" id="lien-he">
          <ContactForm />
        </div>
        <Footer />
      </div>
      {/* END:FOOTER & CONTACT */}
    </>
  );

  const recentPostPageItem = (
    <>
      {/* MARK:RECENT POST */}
      <div className="stack-container py-5">
        <div className="mb-3 container py-5" id="bai-viet">
          <h2 className="title text-center py-3">
            <p>Khám phá các bài viết tại </p>
            <h1 className="text-danger fw-bolder">TFT</h1>
          </h2>
          <div ref={postsRef} className="row">
            {activePosts && activePosts.slice(currentIndex, currentIndex + 3)}
          </div>
          <div className="text-center mt-3">
            <Link to={"/bai-viet"}  className="btn-view-all btn btn-teal px-4 py-2">
              Xem tất cả
            </Link>
          </div>
        </div>
      </div>
      {/* END:RECENT POST */}
    </>
  );

  return (
    <div className="demo-home">
      <ul className="nav justify-content-center fixed-top">
        <li className="nav-item">
          <Link
            onClick={handleNavLink}
            className="nav-logo"
            to="/intro"
            aria-current="page"
          >
            <img className="img-fluid" src="./src/intros/logo.png" alt="" />
          </Link>
        </li>
        <li className="nav-item">
          <a
            onClick={handleNavLink}
            className="nav-link"
            href="#trang-chu"
            aria-current="page"
          >
            Trang chủ
          </a>
        </li>
        <li className="nav-item">
          <a onClick={handleNavLink} className="nav-link" href="#tuyen-sinh">
            Tuyển sinh
          </a>
        </li>
        <li className="nav-item">
          <a onClick={handleNavLink} className="nav-link" href="#sinh-vien">
            Dành cho sinh viên
          </a>
        </li>
        <li className="nav-item">
          <a onClick={handleNavLink} className="nav-link" href="#vinh-danh">
            Vinh danh
          </a>
        </li>
        <li className="nav-item">
          <a onClick={handleNavLink} className="nav-link" href="#lien-he">
            Liên hệ
          </a>
        </li>
      </ul>

      <div ref={banner} id="banner">
        <img
          className="img-fluid"
          src="./src/banners/banner.jpg"
          alt="Trường Cao đẳng Công nghệ Thủ Đức"
        />

        <div className="row banner-container">
          <div className="col-md-7">
            <h1 className="title">
              <span>Chương trình</span>
              <br />
              <b>
                CNTT theo mô hình <br />
                gắn kết với doanh nghiệp
                <br /> &emsp; &<br />
                trường Cao đẳng Nhật Bản
              </b>
            </h1>
          </div>

          <div className="col-md-5">
            <div className="row logos">
              <div className="col-md-6 position-relative">
                <div className="logo logo-vn"></div>
              </div>
              <div className="col-md-6 position-relative">
                <div className="logo logo-ja"></div>
              </div>
              <div className="offset-md-3 col-md-6 position-relative">
                <div className="logo logo-tdc"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {homePageItem}
      {enrollmentPageItem}
      {recentPostPageItem}
      {studentPageItem}
      {apploadPageItem}
      {contactPageItem}
    </div>
  );
}
