import { useEffect, useRef, useState } from "react";
import "./styles.css";
import { useNavigate } from "react-router";
import { apiURL } from "../../App";
import AdminLayout from "../../layouts/AdminLayout";
import Cookies from "js-cookie";
import { Toast } from "primereact/toast";

function Login() {
  const nagivate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");

  const toast = useRef();
  // const cookies = new Cookies();

  const validate = () => {
    let result = true;
    if (email === "" || email === null) {
      toast.current.show({
        severity: "error",
        summary: "Email",
        detail: "Bạn chưa nhập địa chỉ email",
        life: 3000,
      });
      return false;
    }
    if (password === "" || password === null) {
      toast.current.show({
        severity: "error",
        summary: "Mật khẩu",
        detail: "Bạn chưa nhập mật khẩu",
        life: 3000,
      });
      return false;
    }
    return result;
  };

  // hàm cookie
  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  const handleLogin = (e) => {
    e.preventDefault();
    const api = apiURL + "login";
    const data = { email: email, password: password, role: "admin" };

    if (validate()) {
      fetch(api, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          switch (data.status) {
            case 200:
              const user = {
                ...data.infor_user,
                remember_token: data.remember_token,
              };
              window.localStorage.setItem("user", JSON.stringify(user));
              //   setLogin(false);
              // sessionStorage.setItem("email", email);
              // sessionStorage.setItem("remember_token", data.remember_token);
              // setCookie("email", data.email);
              // setCookie("remember_token", data.remember_token);
              console.log(data);
              Cookies.set("email", data.email, { path: "/" });
              Cookies.set("remember_token", data.remember_token, { path: "/" });

              nagivate("/quan-tri");
              setUser(user);

              toast.current.show({
                severity: "success",
                summary: "Đăng nhập",
                detail: "Đăng nhập thành công",
                life: 3000,
              });
              // toast.success(data.message);
              break;
            case 422:
              //   alert(data.message)
              toast.current.show({
                severity: "error",
                summary: "Quản trị",
                detail: "Bạn không có quyền truy cập trang quản trị",
                life: 3000,
              });
              // toast.success(data.message);
              break;
            default:
              break;
          }
        });
    }
  };

  // xóa trên session
  // useEffect(() => {
  //     sessionStorage.clear();
  // }, [])

  useEffect(() => {
    if (localStorage.getItem("infor_user")) {
      nagivate("/quan-tri");
    }
  }, []);

  return (
    <>
      <AdminLayout
        slot={
          <>
            <Toast ref={toast} />
            <div className="container">
              <div class="container d-flex justify-content-center align-items-center min-vh-100">
                <div class="row border rounded-5 p-3 bg-white shadow box-area">
                  <div class="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box image-2">
                    <div class="featured-image mb-3">
                      <img
                        src="../src/images/image1.png"
                        class="img-fluid img-2"
                        style={{ width: "250px;" }}
                      />
                    </div>
                    <p
                      class="text-white fs-2"
                      style={{
                        fontFamily:
                          "'Courier New', Courier, monospace; font-weight: 600;",
                      }}
                    >
                      Be Verified
                    </p>
                    <small
                      class="text-white text-wrap text-center"
                      style={{
                        width: "17rem;",
                        fontFamily: "'Courier New', Courier, monospace;",
                      }}
                    >
                      Join experienced Designers on this platform.
                    </small>
                  </div>
                  <div class="col-md-6 right-box">
                    <div class="row align-items-center">
                      <div class="header-text mb-4">
                        <h2>Hello, Admin</h2>
                        <p>We are happy to have you back.</p>
                      </div>
                      <div class="input-group mb-3">
                        <input
                          type="text"
                          onChange={(e) => setEmail(e.target.value)}
                          class="form-control form-control-lg bg-light fs-6"
                          placeholder="Email address"
                        />
                      </div>
                      <div class="input-group mb-1">
                        <input
                          type="password"
                          onChange={(e) => setPassword(e.target.value)}
                          class="form-control form-control-lg bg-light fs-6"
                          placeholder="Password"
                        />
                      </div>
                      <div class="input-group mb-5 d-flex justify-content-between">
                        <div class="form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            id="formCheck"
                          />
                          <label
                            for="formCheck"
                            class="form-check-label text-secondary"
                          >
                            <small>Remember Me</small>
                          </label>
                        </div>
                        <div class="forgot">
                          <small>
                            <a href="#">Forgot Password?</a>
                          </small>
                        </div>
                      </div>
                      <div class="input-group mb-3">
                        <button
                          onClick={handleLogin}
                          class="btn btn-lg btn-primary w-100 fs-6"
                        >
                          Login
                        </button>
                      </div>
                      <div class="input-group mb-3">
                        <button class="btn btn-lg btn-light w-100 fs-6">
                          <img
                            src="../src/images/gg1.png"
                            style={{ width: "20px" }}
                            class="me-2"
                          />
                          <small>Sign In with Google</small>
                        </button>
                      </div>
                      <div class="row">
                        <small>
                          Don't have account?
                          <a href="#">Sign Up</a>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      ></AdminLayout>
    </>
  );
}

export default Login;
