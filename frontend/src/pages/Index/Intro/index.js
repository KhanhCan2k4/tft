import { Link } from "react-router-dom";
import CarouselBanner from "../../../components/CarouselBanner";
import { useContext, useEffect, useRef, useState } from "react";
import { apiURL, ConfigContext, imageURL } from "../../../App";
import "./styles.css";
import { Parser } from "html-to-react";
import ContactForm from "../../../components/ContactForm";

export default function IntroSubPage() {
  //refs
  const homeBanner = useRef();
  const configs = useContext(ConfigContext);

  //states
  const [banners, setBanners] = useState([]);
  const [post, setPost] = useState();

  useEffect(() => {
    document.title = "Giới thiệu chương trình CNTT TFT";
  }, []);

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
    <div className="p-sm-5">
      <div className="page-content">
        <div className="row mt-lg-1 mt-5">
          {banners && banners.length > 0 && (
            <div className="col-xl col-12">
              <div className="banner">
                <CarouselBanner banners={banners} />
              </div>
            </div>
          )}
          <div className="text-container col-xl col-12">
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
                configs?.find((config) => config.key === "TFT_INFO_LINK")?.value
              }
              className="btn bg-red s text-white mx-2"
            >
              Tìm hiểu thêm
            </a>

            <Link
              to={"/chuong-trinh-dao-tao"}
              className="btn bg-red s text-white mx-2"
            >
              Xem chương trình đào tạo
            </Link>
          </div>

          <div className="col-12 mt-5">
            <div className="row sub-contain">
              <div className="col"></div>

              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div
                  className={
                    "col-lg col-sm-4 sub-item " + (index >= 4 ? "reverse" : "")
                  }
                >
                  <span className="py-3">
                    {Parser().parse(
                      configs?.find(
                        (config) => config.key === `TFT_INTRO_INFO_${index}`
                      )?.value
                    )}
                  </span>
                </div>
              ))}

              <div className="col"></div>
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
