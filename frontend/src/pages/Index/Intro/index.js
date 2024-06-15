import { Link } from "react-router-dom";
import CarouselBanner from "../../../components/CarouselBanner";
import { useEffect, useRef, useState } from "react";
import { apiURL, imageURL } from "../../../App";
import "./styles.css";
import { Parser } from "html-to-react";

export default function IntroSubPage() {
  //refs
  const homeBanner = useRef();

  //states
  const [banners, setBanners] = useState([]);
  const [post, setPost] = useState();

  //fetch banners
  useEffect(() => {
    //fetch
    fetch(apiURL + `banners`)
      .then((res) => res.json())
      .then((banners) => {
        setBanners(banners);
        handleRunningBanner(banners);
      })
      .catch((err) => {
        console.log(err);
        setBanners([]);
      })
      .finally(() => {});
  }, []);

  //fetch intro post
  useEffect(() => {
    const api = apiURL + "posts/1";

    fetch(api)
      .then((res) => res.json())
      .then((post) => {
        if (post) {
          setPost(post);
        }
      })
      .catch((err) => {
        console.log("Fetch intro post", err);
      });
  }, []);

  //reset banner after 5s
  const handleRunningBanner = (banners) => {
    setTimeout(function loadBanner(currentIndex) {
      currentIndex = currentIndex ?? 0;

      if (currentIndex >= banners.length) {
        currentIndex = 0;
      }

      if (homeBanner.current) {
        homeBanner.current.src = imageURL + banners[currentIndex]?.img;
      }
      currentIndex++;

      setTimeout(() => loadBanner(currentIndex), 5000);
    }, 5000);
  };

  return (
    <div className="p-5">
      <div className="page-content">
        <div className="row mt-5">
          <div className="col-md-6">
            <div className="banner">
              <CarouselBanner banners={banners} />
            </div>
          </div>
          <div className="text-container col-md-6">
            <div className="home-intro">
              <h3 className="title">
                <span>Chương trình</span>
                <br />
                <b>
                  "CNTT theo mô hình gắn kết với doanh nghiệp &amp; trường cao
                  đẳng Nhật Bản"
                </b>
              </h3>
            </div>
            <h6 className="text pb-3 ps-4">
              {Parser().parse(post && post.content)}
            </h6>
            <a
              target="_blank"
              rel="noreferrer"
              href={
                "http://fit.tdc.edu.vn/tin-tuc/fit-tdc-tuyen-sinh-chuong-trinh-cong-nghe-thong-tin-gan-ket-voi-doi-tac-nhat-ban"
              }
              className="btn-view"
            >
              Tìm hiểu thêm
            </a>

            <Link to={"/chuong-trinh-dao-tao"} className="btn-view">
              Xem chương trình đào tạo
            </Link>
          </div>
          <div className="col-12 mt-5">
            <div className="row sub-contain">
              <div className="col"></div>
              <div className="col sub-item">
                <span className="py-3">
                  Hỗ trợ
                  <br />
                  <b>¥5000/tháng</b>
                </span>
              </div>
              <div className="col sub-item">
                <span className="py-3">
                  Miễn phí
                  <br />
                  <b>600 giờ học tiếng Nhật</b>
                </span>
              </div>
              <div className="col sub-item">
                <span className="py-3">
                  Chỉ tiêu
                  <br />
                  <b>30 sinh viên/khoá</b>
                </span>
              </div>
              <div className="col sub-item reverse">
                <span className="py-3">
                  Đảm bảo
                  <br />
                  <b>100% có việc làm</b>
                </span>
              </div>
              <div className="col sub-item reverse">
                <span className="py-3">
                  Đào tạo
                  <br />
                  <b>Thời gian đào tạo 3 năm</b>
                </span>
              </div>
              <div className="col sub-item reverse">
                <span className="py-3">
                  Cam kết
                  <br />
                  <b>Làm việc 3 năm tại Nhật</b>
                </span>
              </div>
              <div className="col"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
