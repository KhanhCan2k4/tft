import "./styles.css";

export default function HomeSubPage() {
  return (
    <div className="home-sub-page">
      <div className="row">
        <div className="title-frame col-md-6">
          <h4 className="title">
            <span>Chương trình</span>
            <br />
            <b>
              CNTT theo mô hình <br />
              gắn kết với doanh nghiệp
              <br /> &emsp; &<br />
              trường Cao đẳng Nhật Bản
            </b>
          </h4>
        </div>

        <div className="col-md-6">
          <div className="row logos">
            <div className="col-md-6 col-12">
              <div className="logo logo-vn">
                <img src="./src/intros/vietnam.webp" alt="Việt Nam" />
              </div>
            </div>

            <div className="col-md-6 col-12">
              <div className="logo logo-ja">
                <img src="./src/intros/japan.webp" alt="Nhật Bản" />
              </div>
            </div>
          </div>
        </div>

        <div className="container mt-3">
          <div className="row">
            <div className="offset-md-3 col-md-6">
              <div className="logo logo-ja">
                <img src="./src/intros/introo.jpg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
