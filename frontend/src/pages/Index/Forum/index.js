import "./styles.css";
import Threat from "../../../components/Threat";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { TFT_THREATS, apiURL, imageURL } from "../../../App";
import { TFT_REMEMBER_TOKEN } from "../../Admin/Login";
import { Chip } from "@mui/material";
import { Button, Card } from "antd";
import { PersonBoundingBox, PersonCircle } from "react-bootstrap-icons";

export default function ForumSubPage() {
  //refs
  const passRef = useRef();
  const newPassRef = useRef();
  const mssvRef = useRef();
  const toast = useRef();
  const myThreatCard = useRef();
  const avatarRef = useRef();

  //states
  const [show, setShow] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [threat, setThreat] = useState({ content: "", tags: [] });

  const [user, setUser] = useState();

  const [threats, setThreats] = useState([]);
  const [activeThreat, setActiveThreat] = useState();

  //effects
  useEffect(() => {
    getThreats();
  }, []);

  useEffect(() => {
    document.title = "Cộng đồng TFT - Giải đáp thắc mắc";
  }, []);

  function getThreats() {
    const api = apiURL + "threats";
    fetch(api)
      .then((res) => res.json())
      .then((threats) => {
        setThreats(threats);

        if (!activeThreat) {
          setActiveThreat(threat[0]);
        } else {
          setActiveThreat(
            threats.find((threat) => threat.id === activeThreat.id) ?? threat[0]
          );
        }
      })
      .catch((err) => {
        console.log("fetch threats", err);
      });
  }

  function checkLogin() {
    //get token
    const token = localStorage.getItem(TFT_REMEMBER_TOKEN);

    //check token
    const api = apiURL + "login/auth/user";

    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLogin(data != null);
        setUser(data);
      })
      .catch((err) => {
        console.log("check login", err);
        setIsLogin(false);
      });
  }

  //check login
  useEffect(() => {
    checkLogin();
  }, []);

  const handleLogin = () => {
    //validate
    if (!/^\d{5}[tT]{2}\d{4}$/.test(mssvRef.current.value)) {
      toast?.current?.show({
        severity: "error",
        summary: "Đăng nhập",
        detail: "Đăng nhập không thành công",
        life: 3000,
      });
      return;
    }

    if (!/^.{6,50}$/.test(passRef.current.value)) {
      toast?.current?.show({
        severity: "error",
        summary: "Đăng nhập",
        detail: "Đăng nhập không thành công",
        life: 3000,
      });
      return;
    }

    const api = apiURL + "login";

    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mssv: mssvRef.current.value,
        password: passRef.current.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem(TFT_REMEMBER_TOKEN, data.token);
        setIsLogin(true);
        setShow(false);
      })
      .catch((err) => {
        console.log("login", err);
        toast?.current?.show({
          severity: "error",
          summary: "Đăng nhập",
          detail: "Đăng nhập không thành công",
          life: 3000,
        });
      })
      .finally(() => {
        checkLogin();
      });
  };

  const handleLogout = (e) => {
    const token = localStorage.getItem(TFT_REMEMBER_TOKEN);
    localStorage.removeItem(TFT_REMEMBER_TOKEN);

    const api = apiURL + "tokens/" + token;

    fetch(api, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    setIsLogin(false);
    setUser(null);
    setShow(false);
  };

  const handlePostAThreat = () => {
    const api = apiURL + "threats";

    if (threat && !threat.content) {
      toast?.current?.show({
        severity: "error",
        summary: "Đăng câu hỏi",
        detail: "Bạn chưa nhập nội dung. Vui lòng thử lại",
        life: 3000,
      });
      return;
    }

    if (threat && threat.content && threat.content.length < 15) {
      toast?.current?.show({
        severity: "error",
        summary: "Đăng câu hỏi",
        detail:
          "Câu hỏi có nội dung quá ngắn (dưới 15 ký tự). Vui lòng thử lại",
        life: 3000,
      });
      return;
    }

    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(threat),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          toast?.current?.show({
            severity: "success",
            summary: "Đăng câu hỏi",
            detail: "Đăng câu hỏi thành công",
            life: 10000,
          });

          const threats = JSON.parse(localStorage.getItem(TFT_THREATS)) ?? [];
          threats.push(data.threat.id);

          localStorage.setItem(TFT_THREATS, JSON.stringify(threats));

          myThreatCard.current.scrollTop = 0;
        } else {
          toast?.current?.show({
            severity: "error",
            summary: "Đăng câu hỏi",
            detail:
              "Đăng câu hỏi không thành công. Câu hỏi của bạn có chứa nhiều từ ngữ nhạy cảm, vui lòng thử lại",
            life: 3000,
          });
        }
      })
      .catch(() => {
        toast?.current?.show({
          severity: "error",
          summary: "Đăng câu hỏi",
          detail:
            "Đăng câu hỏi không thành công. Câu hỏi của bạn có chứa nhiều từ ngữ nhạy cảm, vui lòng thử lại",
          life: 3000,
        });
      })
      .finally(() => {
        setThreat({ ...threat, content: "" });
        getThreats();
      });
  };

  const handleResetPass = () => {
    const pass = newPassRef.current.value;

    const api = apiURL + "user/new/pass/" + user.id;

    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pass }),
    })
      .then((res) => res.json())
      .finally(() => {
        handleLogout();
      });
  };

  const handleArchiement = () => {
    const api = apiURL + "user/new/achievements/" + user.id;

    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ achievements: user.achievements }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser({ ...user, achievements: data.achievements });
      })
      .finally(() => {
        toast?.current?.show({
          severity: "success",
          summary: "Thay đổi thông tin",
          detail: "thay đổi thông tin thành công",
          life: 3000,
        });
      });
  };

  const handleRemoveThreat = (id) => {
    const api = apiURL + "threats/" + id;

    fetch(api, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }).finally(() => {
      toast?.current?.show({
        severity: "success",
        summary: "Xoá câu hỏi",
        detail: "Xoá câu hỏi thành công",
        life: 3000,
      });
      getThreats();
    });
  };

  const handleUploadAvatar = (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("avatar", file);
    avatarRef.current.src = URL.createObjectURL(file);

    const api = apiURL + "user/avatar/" + user.id;
    fetch(api, {
      method: "POST",
      body: formData,
    })
      .then((data) => {
        if (data.status === 200) {
          user.avatar = data.avatar;
          toast?.current?.show({
            severity: "success",
            summary: "Thay ảnh đại diện",
            detail: "Thay ảnh đại diện thành công",
            life: 3000,
          });
        } else {
          toast?.current?.show({
            severity: "error",
            summary: "Thay ảnh đại diện",
            detail: "Thay ảnh đại diện không thành công",
            life: 3000,
          });
        }
      })
      .catch((err) => {
        console.log("chang avatar", err);
        toast?.current?.show({
          severity: "error",
          summary: "Thay ảnh đại diện",
          detail: "Thay ảnh đại diện không thành công",
          life: 3000,
        });
      });
  };

  return (
    <div id="sub-forum-page">
      <Toast position="center" ref={toast} />

      <div className="row">
        {/* user info */}
        <div className="col-lg-3 order-lg-first text-center order-last">
          {(isLogin && (
            <Card>
              <Chip
                className="m-1"
                label={<b>Thông tin đăng nhập / Thông tin tài khoản</b>}
              />
              <br />
              <small style={{ fontSize: "0.8em" }}>
                <i>
                  Bạn đang là thành viên tại <b>TFT</b>
                </i>
              </small>

              {(user && user.avatar && user.avatar && (
                <img
                  ref={avatarRef}
                  src={imageURL + user.avatar}
                  alt="Ảnh đại diện"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                  }}
                  className="d-block my-2 mx-auto"
                />
              )) || (
                <PersonCircle
                  style={{ width: "150px", height: "150px" }}
                  className="d-block my-2 mx-auto"
                />
              )}

              <div className="text-center mt-2">
                <label htmlFor="upload">
                  <span className="btn pb-2" aria-hidden={true}>
                    <PersonBoundingBox />
                  </span>
                  <input
                    type="file"
                    onChange={handleUploadAvatar}
                    accept="image/png, image/gif, image/jpeg"
                    id="upload"
                    style={{ display: "none" }}
                  />
                </label>
              </div>

              <Chip
                className="m-2 w-100"
                label={
                  <div>
                    <span>Sinh viên </span>
                    <b>{(user && user.name) || "không xác định"}</b>
                  </div>
                }
              />

              <Chip
                className="m-2 w-100"
                label={
                  <div>
                    <span>MSSV </span>
                    <b>{(user && user.mssv) || "không xác định"}</b>
                  </div>
                }
              />

              <Chip
                className="m-2 w-100 py-2"
                label={
                  <div>
                    <span>Khoá </span>
                    <b>
                      {(user &&
                        user.class &&
                        (+user.class.substring(2, 4) - 18 >= 1
                          ? +user.class.substring(2, 4) - 18
                          : 0)) ||
                        "không xác định"}
                    </b>
                    {" / "}
                    <span>Lớp </span>
                    <b>{(user && user.class) || "không xác định"}</b>
                  </div>
                }
              />

              <small>Tiểu sử/Thành tích</small>
              <div className="row">
                <div className="col-8">
                  <textarea
                    onChange={(e) =>
                      setUser({ ...user, achievements: e.target.value })
                    }
                    className="form-control mt-2"
                    type="text"
                    rows={5}
                    defaultValue={user && user.achievements}
                  />
                </div>

                <div className="col-2">
                  <button
                    className="mt-1 mb-2 btn"
                    danger
                    onClick={handleArchiement}
                  >
                    Lưu
                  </button>
                </div>
              </div>

              <br />
              <small>Mật khẩu mới</small>
              <div className="row">
                <div className="col-9 col-lg-6 col-xl-8">
                  <input
                    ref={newPassRef}
                    className="form-control"
                    type="password"
                    placeholder="..."
                  />
                </div>

                <div className="col-2">
                  <button
                    className="mt-1 mb-2 btn"
                    danger
                    onClick={handleResetPass}
                  >
                    Lưu
                  </button>
                </div>
              </div>

              <button danger onClick={handleLogout} className="my-2 btn">
                Đăng xuất
              </button>
            </Card>
          )) || (
            <Card>
              <Chip
                className="m-1"
                label={<b>Thông tin đăng nhập / Thông tin tài khoản</b>}
              />
              <br />
              <small>
                Bạn không phải là thành viên của TFT
                <p>
                  <i>
                    Chỉ thành viên tại TFT với có quyền hồi đáp.
                    <br />
                    <b>Đăng nhập ngay</b> nếu bạn là sinh viên TFT
                  </i>
                </p>
              </small>

              <div className="row">
                <div className="col-lg-2">MSSV</div>
                <div className="col-lg-10">
                  <input
                    ref={mssvRef}
                    className="form-control"
                    type="text"
                    placeholder="Điền mã số sinh viên"
                  />
                </div>

                <div className="col-lg-2 mt-1">Mật khẩu</div>
                <div className="col-lg-10 mt-1">
                  <input
                    ref={passRef}
                    className="form-control"
                    type="password"
                    placeholder="Điền mật khẩu"
                  />
                </div>
              </div>

              <button danger onClick={handleLogin} className="my-2 btn">
                Đăng nhập
              </button>
              <br />
            </Card>
          )}
        </div>

        {/* threats */}
        <div className="col-lg-6">
          <Chip className="m-1" label={<b>Thảo luận về TFT</b>} />
          <br />
          <small className="px-2" style={{ fontSize: "0.8em" }}>
            <i>
              Đừng ngần ngại đặt câu hỏi để được chính các sinh viên TFT giải
              đáp một cách nhanh nhất có thể nhé
            </i>
          </small>

          <div ref={myThreatCard} className="threats p-3">
            {threats &&
              threats.map((threat) => (
                <Threat
                  key={threat.id}
                  threat={threat}
                  handleRemove={handleRemoveThreat}
                  setActive={setActiveThreat}
                  isActive={activeThreat && threat.id === activeThreat.id}
                />
              ))}
          </div>
        </div>

        {/* add */}
        <div className="col-lg-3">
          <Card>
            <Chip className="m-1" label={<b>Đặt câu hỏi tại đây</b>} />
            <div className="frame-container">
              <textarea
                style={{ fontSize: "0.8em" }}
                onChange={(e) =>
                  setThreat({ ...threat, content: e.target.value })
                }
                className="form-control my-3"
                rows={8}
                value={threat && threat.content}
              ></textarea>

              <small style={{ fontSize: "0.8em" }}>
                Những câu hỏi tham khảo
              </small>
              <select
                onChange={(e) =>
                  setThreat({ ...threat, content: e.target.value })
                }
                style={{ fontSize: "0.8em" }}
                className="form-control"
              >
                <option>
                  Chương trình CNTT liên kết với doanh nghiệp và trường cao đẳng
                  Nhật Bản có thời gian đào tạo trong bao lâu?
                </option>
                <option>
                  Chương trình CNTT liên kết với doanh nghiệp và trường cao đẳng
                  Nhật Bản khi nào bắt đầu tuyển sinh?
                </option>

                <option>
                  Chương trình CNTT liên kết với doanh nghiệp và trường cao đẳng
                  Nhật Bản bao gồm những khái niệm và kỹ năng quan trọng nào?
                </option>

                <option>
                  Các tiêu chuẩn ưu tiên cho từng khóa học là gì? Làm thế nào để
                  chúng được nhấn mạnh trong suốt năm học?
                </option>

                <option>
                  Chương trình CNTT liên kết với doanh nghiệp và trường cao đẳng
                  Nhật Bản có nội dung học tập như thế nào. Nội dung chương
                  trình có được cập nhật không?
                </option>

                <option>
                  Chương trình CNTT liên kết với doanh nghiệp và trường cao đẳng
                  Nhật Bản có yêu cầu đầu ra cho sinh viên như thế nào?
                </option>
              </select>

              <div className="text-center">
                <button danger onClick={handlePostAThreat} className="mt-3 btn">
                  Đăng câu hỏi
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
