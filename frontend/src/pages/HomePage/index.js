import "./styles.css";
import NavBar from "./../../components/Navbar/index";
import Footer from "../../components/Footer";
import CarouselAppload from "../../components/CarouselAppload";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="home-page">
      <header>
        <NavBar />
      </header>

      <div id="head-banner">
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

      <div id="main-content"></div>

      <footer id="main-footer">
        <div id="vinh-danh">
          <div className="page-content">
            <div className="appload-student">
              <CarouselAppload />
            </div>
            <Link className="btn-view" to={"/vinh-danh"}>
              Xem chi tiết
            </Link>
          </div>
        </div>

        <div className="mb-3 container" id="lien-he">
          <label for="" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            name=""
            id=""
            aria-describedby="emailHelpId"
            placeholder="abc@mail.com"
          />
          <small id="emailHelpId" className="form-text text-muted">
            Help text
          </small>
        </div>
        <Footer />
      </footer>
    </div>
  );
}
