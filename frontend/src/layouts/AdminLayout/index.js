import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Toast } from "primereact/toast";
import { Nav, NavItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./styles.css";
import { TFT_REMEMBER_TOKEN, checkLogin } from "../../pages/Admin/Login";

export default function AdminLayout({ slot, activeIndex = 0 }) {
  //refs
  const toast = useRef();
  const navigate = useNavigate();

  //states
  const [navbarItems, setNavbarItems] = useState([]);

  //handles
  useEffect(() => {
    checkLogin(
      () => {},
      () => navigate("/admin/login")
    );
  }, []);

  //set navbar items
  useEffect(() => {
    setNavbarItems([
      {
        link: "/admin",
        text: "INTRO",
      },
      {
        link: "/admin/users",
        text: "USERS",
      },
      {
        link: "/admin/posts",
        text: "POSTS",
      },
      {
        link: "/admin/forums",
        text: "FORUMS",
      },
      {
        link: "/admin/contacts",
        text: "CONTACTS",
      },
    ]);
  }, []);

  //active when choosing a nav
  const handleNav = (e) => {
    document
      .querySelector(".admin-layout .admin-nav .nav-item.active")
      ?.classList.remove("active");
    e.target.classList.remove("active");
    e.target.classList.add("active");

    navigate(e.target.dataset.link);
  };

  const handleLogout = () => {
    localStorage.removeItem(TFT_REMEMBER_TOKEN);
    navigate("/admin/login");
  };

  return (
    <div className="admin-layout">
      <Toast ref={toast} />

      <div className="row">
        <div className="admin-nav col-md-3 bg-dark text-white p-3">
          <Nav
            variant="tabs"
            defaultActiveKey="/admin/intro"
            className="flex-column"
          >
            <NavItem>
              <div className="text-center">
                <img
                  className="logo img-fluid"
                  src="./../src/intros/logo.png"
                  alt="FIT TDC"
                  title="Khoa công nghệ thông tin- Trường cao đẳng Công nghệ Thủ Đức"
                />
              </div>
            </NavItem>

            {navbarItems &&
              navbarItems.map((item, index) => (
                <NavItem
                  key={item.link}
                  onClick={handleNav}
                  data-link={item.link}
                  className={
                    "text-decoration-none text-white btn btn-outline-secondary m-2 p-3" +
                    (activeIndex === index ? " active" : "")
                  }
                >
                  {item.text}
                </NavItem>
              ))}

            <hr />
            <NavItem
              onClick={handleLogout}
              className="btn btn-outline-secondary m-2 p-3"
            >
              <Link
                to="/admin/intro"
                className="text-decoration-none text-white fw-bold"
              >
                LOGOUT
              </Link>
            </NavItem>
          </Nav>
        </div>

        <div className="admin-content col-md-9 py-3 px-5">{slot}</div>
      </div>
    </div>
  );
}
