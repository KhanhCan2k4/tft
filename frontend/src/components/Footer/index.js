import { useContext } from "react";
import { Link } from "react-router-dom";
import { ConfigContext } from "../../App";

export default function Footer() {
  const configs = useContext(ConfigContext);
  return (
    <footer className=" text-white p-5">
      <div className="container">
        <div className="row">
          <div className="col-12 offset-1 mb-2">
            <h4>
              KHOA CÔNG NGHỆ THÔNG TIN
              <br />
              Trường Cao Đẳng Công Nghệ Thủ Đức
            </h4>
          </div>
          <div className="col-md-6 offset-1">
            <div className="footerinfo">
              <p>
                {configs?.find((config) => config.key === "TFT_ADDRESS")?.value}
              </p>
              <p>
                Điện thoại:{" "}
                {configs?.find((config) => config.key === "TFT_PHONE")?.value}
              </p>
              <p>
                Email:{" "}
                {configs?.find((config) => config.key === "TFT_EMAIL")?.value}
              </p>
              <p>
                Facebook:{" "}
                <a
                  href={
                    configs?.find((config) => config.key === "FACEBOOK_LINK")
                      ?.value
                  }
                >
                  {configs
                    ?.find((config) => config.key === "FACEBOOK_LINK")
                    ?.value?.replace("https://www.", "")
                    .replace("http://www.", "")}
                </a>
              </p>
              <p>
                Youtube:{" "}
                <a
                  href={
                    configs?.find((config) => config.key === "YOUTUBE_LINK")
                      ?.value
                  }
                >
                  {configs
                    ?.find((config) => config.key === "YOUTUBE_LINK")
                    ?.value?.replace("https://www.", "")
                    .replace("http://www.", "")}
                </a>
              </p>
              <p>
                LinkedIn:{" "}
                <a
                  href={
                    configs?.find((config) => config.key === "LINKEDIN_LINK")
                      ?.value
                  }
                >
                  {configs
                    ?.find((config) => config.key === "LINKEDIN_LINK")
                    ?.value?.replace("https://www.", "")
                    .replace("http://www.", "")}
                </a>
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <ul className="bottom-link">
              <li className="">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    configs?.find((config) => config.key === "TFT_INFO_LINK")
                      ?.value
                  }
                >
                  Xem thông tin chi tiết
                </a>
              </li>
              <hr />

              <li className="">
                <Link to="/chuong-trinh-dao-tao">Xem chương trình đào tạo</Link>
              </li>
              <hr />

              <li className="">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    configs?.find((config) => config.key === "TDC_WEB_LINK")
                      ?.value
                  }
                >
                  Trường Cao Đẳng Công Nghệ Thủ Đức
                </a>
              </li>
              <hr />

              <li className="">
                2024{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    configs?.find((config) => config.key === "FIT_WEB_LINK")
                      ?.value
                  }
                >
                  Khoa Công nghệ thông tin | Cao đẳng Công nghệ Thủ Đức | FIT -
                  TDC
                </a>{" "}
                All Rights Reserved.
              </li>
              <hr />
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
