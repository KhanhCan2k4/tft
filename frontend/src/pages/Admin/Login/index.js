import { useEffect, useRef, useState } from "react";
import "./styles.css";
import { useNavigate } from "react-router";
import { Toast } from "primereact/toast";
import AdminLayout from "../../../layouts/AdminLayout";
import { apiURL } from "../../../App";

export const TFT_REMEMBER_TOKEN = "TFT_REMEMBER_TOKEN";

export function checkLogin(action = () => {}, errorAction = () => {}) {
  const token = localStorage.getItem(TFT_REMEMBER_TOKEN);
  const api = apiURL + "login/auth/admin";

  fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({token: token}),
  })
    .then((res) => res.json())
    .then((data) => {
      switch (data) {
        case 200:
          action();
          break;
        default:
          errorAction();
      }
    })
    .catch((err) => {
      console.log(err);
      errorAction();
    });
}

export function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function Login() {
  const nagivate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const toast = useRef();

  const handleLogin = (e) => {
    e.preventDefault();
    const api = apiURL + "login/admin";
    const data = { name: name, password: password };

    if (!name) {
      toast.current.show({
        severity: "error",
        summary: "Name",
        detail: "Name is required",
        life: 3000,
      });
      return;
    }
    if (!password) {
      toast.current.show({
        severity: "error",
        summary: "Password",
        detail: "Password is required",
        life: 3000,
      });
      return;
    }

    e.target.style.display = "none";

    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        switch (data.status) {
          case 200:
            localStorage.setItem(TFT_REMEMBER_TOKEN, data.token);
            nagivate("/admin");

            toast.current.show({
              severity: "success",
              summary: "Login",
              detail: "Đăng nhập thành công",
              life: 3000,
            });

            break;
          default:
            toast.current.show({
              severity: "error",
              summary: "Login",
              detail: "Unauthorized",
              life: 3000,
            });

            break;
        }
      })
      .catch((err) => {
        console.log(err);

        toast.current.show({
          severity: "error",
          summary: "Login",
          detail: "Unauthorized",
          life: 3000,
        });
      })
      .finally(() => {
        console.log("login completed");
        e.target.style.display = "unset";
      });
  };

  useEffect(() => {
    checkLogin(() => nagivate("/admin"));
  }, []);

  return (
    <AdminLayout
      activeIndex={-1}
      slot={
        <>
          <Toast ref={toast} />

          <div className="container">
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
              <div className="row border rounded-5 p-3 bg-white shadow box-area">
                <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box image-2">
                  <div className="featured-image mb-3">
                    <img
                      src="../src/images/image1.png"
                      alt=""
                      className="img-fluid img-2"
                      style={{ width: "250px" }}
                    />
                  </div>
                  <p
                    className="text-white fs-2"
                    style={{
                      fontFamily:
                        "'Courier New', Courier, monospace; font-weight: 600",
                    }}
                  >
                    Be Verified
                  </p>
                  <small
                    className="text-white text-wrap text-center"
                    style={{
                      width: "17rem",
                      fontFamily: "'Courier New', Courier, monospace",
                    }}
                  >
                    Start a new day as a administrator
                  </small>
                </div>
                <div className="col-md-6 right-box">
                  <div className="row align-items-center">
                    <div className="header-text mb-4">
                      <h2>Hello, Admin</h2>
                      <p>We are happy to have you back.</p>
                    </div>

                    <div className="input-group mb-3">
                      <input
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        className="form-control form-control-lg bg-light fs-6"
                        placeholder="Name"
                      />
                    </div>

                    <div className="input-group mb-3">
                      <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control form-control-lg bg-light fs-6"
                        placeholder="Password"
                      />
                    </div>
                  </div>
                  <div className="input-group mb-3">
                    <button
                      onClick={handleLogin}
                      className="btn btn-lg w-100 fs-6"
                    >
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    ></AdminLayout>
  );
}

export default Login;
