import MultipleSelectTags from "../../../components/ChooseTag";
import "./styles.css";
import Comment from "../../../components/Comment";
import Threat from "../../../components/Threat";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { CloseButton, Modal, ModalBody } from "react-bootstrap";
import { apiURL, imageURL } from "../../../App";
import { TFT_REMEMBER_TOKEN } from "../../Admin/Login";
import { Avatar, Chip } from "@mui/material";

export default function ForumSubPage() {
  //refs
  const btnAdd = useRef();
  const passRef = useRef();
  const newPassRef = useRef();
  const mssvRef = useRef();
  const commentRef = useRef();
  const toast = useRef();

  //states
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isFirst, setIsFirst] = useState(false);
  const [threat, setThreat] = useState({ content: "", tags: [] });

  const [user, setUser] = useState();

  const [threats, setThreats] = useState([]);
  const [activeThreat, setActiveThreat] = useState();

  //effects
  useEffect(() => {
    getThreats();
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

  //handles
  const handleShowAddFrame = (e) => {
    if (btnAdd.current.className.includes("show")) {
      //hide
      btnAdd.current.className =
        "btn-add btn btn-dark bi bi-arrow-up-right-circle-fill";
    } else {
      //show
      btnAdd.current.className =
        "btn-add btn btn-danger bi bi-arrow-down-left-circle-fill show";
    }
  };

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

  const handelComment = (e) => {
    const comment = commentRef.current.value;
    commentRef.current.value = "";

    const token = localStorage.getItem(TFT_REMEMBER_TOKEN);

    const api = apiURL + "comments";

    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: comment,
        token: token,
        threat: activeThreat.id,
      }),
    }).finally(() => {
      getThreats();
    });
  };

  const handleForgetPassWord = (e) => {};

  const handleClose = (e) => {
    setShow(false);
    setIsFirst(false);
  };

  const handleLogout = (e) => {
    localStorage.removeItem(TFT_REMEMBER_TOKEN);
    setIsLogin(false);
    setUser(null);
    setShow(false);
  };

  const handleChangePass = (e) => {};

  const handlePostAThreat = () => {
    handleShowAddFrame();

    const api = apiURL + "threats";

    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(threat),
    }).finally(() => {
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
      });
  };

  return (
    <div id="sub-forum-page">
      <Toast ref={toast} />

      <div className="forum-container container position-relative">
        <button
          onClick={handleShowAddFrame}
          className="btn btn-danger btn-add-threat bi bi-file-earmark-plus-fill"
        ></button>

        {!isLogin ? (
          <button
            onClick={() => setShow(true)}
            className="btn btn-danger btn-add-threat bi bi-box-arrow-in-right mt-5"
          ></button>
        ) : (
          <Avatar
            onClick={() => setShowEdit(true)}
            className="btn-add-threat mt-5"
            src=""
            alt="Hihi"
          />
        )}

        <div className="row">
          <div className="col-md-6">
            <div className="threats">
              {threats &&
                threats.map((threat) => (
                  <Threat
                    key={threat.id}
                    threat={threat}
                    setActive={setActiveThreat}
                    isActive={activeThreat && threat.id === activeThreat.id}
                  />
                ))}
            </div>
          </div>

          <div className="col-md-6">
            {activeThreat && (
              <div className="threat-discussion">
                <div className="threat-header bg-white p-3">
                  <b>THẢO LUẬN</b>
                </div>
                <div className="threat-body p-3">
                  {activeThreat.comments &&
                    activeThreat.comments.map((comment) => (
                      <Comment comment={comment} beLongsToMe={false} />
                    ))}
                </div>
                <div className="threat-footer bg-white p-3">
                  <div className="row">
                    <div className="col-10">
                      <input
                        ref={commentRef}
                        type="text"
                        className="form-control"
                      />
                    </div>
                    <div className="col-2">
                      <button
                        onClick={isLogin ? handelComment : () => setShow(true)}
                        className="btn btn-danger bi bi-arrow-up-right-circle-fill"
                      ></button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="add-frame">
        <button
          ref={btnAdd}
          onClick={handleShowAddFrame}
          className="btn-add btn btn-dark bi bi-arrow-up-right-circle-fill"
        ></button>

        <div className="frame-container">
          <h6>{"Thêm câu hỏi cho cộng đồng"}</h6>
          <textarea
            onChange={(e) => setThreat({ ...threat, content: e.target.value })}
            className="form-control my-3"
            rows={4}
          ></textarea>

          <div className="text-center">
            <button onClick={handlePostAThreat} className="btn btn-dark mt-3">
              Đăng câu hỏi
            </button>
          </div>
        </div>

        <Modal size="lg" show={show && !isLogin} onHide={handleClose}>
          <ModalBody>
            <CloseButton onClick={handleClose} />

            <h5>Bạn không phải là thành viên của TFT</h5>
            <p>
              <i>
                Chỉ thành viên tại TFT với có quyền hồi đáp.
                <br />
                <b>Đăng nhập ngay</b> nếu bạn là sinh viên TFT
              </i>
            </p>

            <div className="row">
              <div className="col-md-2">MSSV</div>
              <div className="col-md-10">
                <input
                  ref={mssvRef}
                  className="form-control"
                  type="text"
                  placeholder="Điền mã số sinh viên"
                />
              </div>

              <div className="col-md-2 mt-1">Mật khẩu</div>
              <div className="col-md-10 mt-1">
                <input
                  ref={passRef}
                  className="form-control"
                  type="password"
                  placeholder="Điền mật khẩu"
                />
              </div>

              {isFirst && (
                <>
                  <div className="col-md-2 mt-1">Mật khẩu mới</div>
                  <div className="col-md-10 mt-1">
                    <input
                      ref={newPassRef}
                      className="form-control"
                      type="password"
                      placeholder="Điền mật khẩu mới"
                    />
                  </div>
                </>
              )}

              <button
                onClick={handleLogin}
                className="btn btn-danger col-md-6 offset-md-3 my-2"
              >
                Đăng nhập
              </button>

              <div className="col-md-3"></div>

              <Chip
                onClick={handleForgetPassWord}
                label="Quên mật khẩu"
                className="col-md-3"
                style={{ cursor: "pointer" }}
              />

              <Chip
                onClick={() => setIsFirst(true)}
                label="Thay đổi mật khẩu"
                className="col-md-3 ms-1"
                style={{ cursor: "pointer" }}
              />
            </div>
          </ModalBody>
        </Modal>

        <Modal size="lg" show={showEdit} onHide={() => setShowEdit(false)}>
          <ModalBody>
            <CloseButton onClick={() => setShowEdit(false)} />

            <h5>Thông tin tài khoản</h5>
            <p>
              <i>
                Bạn đang là thành viên tại <b>TFT</b>
              </i>
            </p>

            <div className="row">
              <div className="offset-md-3 col-md-6">
                <Avatar
                  src={user && user.avatar && imageURL + user.avatar}
                  alt={user && user.name}
                  style={{ width: "200px", height: "200px" }}
                  className="mx-auto"
                />
                <div className="text-center mt-2">
                  <button className="btn btn-danger">Thay ảnh đại diện</button>
                </div>
              </div>
              <div className="col-md-3"></div>

              <div className="col-md-6 mt-2">
                <input
                  className="form-control"
                  type="text"
                  value={
                    user &&
                    user.class &&
                    "Sinh viên khoá " +
                      (+user.class.substring(2, 4) - 18 >= 1
                        ? +user.class.substring(2, 4) - 18
                        : 0)
                  }
                  readOnly={true}
                />
              </div>

              <div className="col-md-6 mt-2">
                <input
                  className="form-control"
                  type="text"
                  value={user && user.class && "Sinh viên lớp " + user.class}
                  readOnly={true}
                />
              </div>

              <div className="col-md-2 mt-3">Tên sinh viên</div>
              <div className="col-md-10 mt-3">
                <input
                  className="form-control"
                  value={user && user.name}
                  type="text"
                  readOnly={true}
                />
              </div>

              <div className="col-md-2 mt-2">MSSV</div>
              <div className="col-md-10">
                <input
                  className="form-control mt-2"
                  type="text"
                  value={user && user.mssv}
                  readOnly={true}
                />
              </div>

              <div className="col-md-2 mt-2">Tiểu sử/Thành tích</div>
              <div className="col-md-8">
                <textarea
                  onChange={(e) =>
                    setUser({ ...user, achievements: e.target.value })
                  }
                  className="form-control mt-2"
                  type="text"
                  rows={3}
                >
                  {user && user.achievements}
                </textarea>
              </div>
              <div className="col-md-2 mt-2">
                <button onClick={handleArchiement} className="btn btn-danger">
                  Lưu
                </button>
              </div>

              <div className="col-md-2 mt-2">Mật khẩu mới</div>
              <div className="col-md-8 mt-2">
                <input
                  ref={newPassRef}
                  className="form-control"
                  type="password"
                  placeholder="Điền mật khẩu mới"
                />
              </div>
              <div className="col-md-2 mt-2">
                <button onClick={handleResetPass} className="btn btn-danger">
                  Xác nhận
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-danger col-md-6 offset-md-3 my-4"
              >
                Đăng xuất
              </button>

              <div className="col-md-3"></div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
}
