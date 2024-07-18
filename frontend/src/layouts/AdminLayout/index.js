import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Toast } from "primereact/toast";
import { Nav, NavItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./styles.css";
import { TFT_REMEMBER_TOKEN, checkLogin } from "../../pages/Admin/Login";
import { Button, Card, Popconfirm } from "antd";

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
        link: "/admin/forum",
        text: "FORUM",
      },
      {
        link: "/admin/contacts",
        text: "CONTACTS",
      },
      {
        link: "/admin/curriculums",
        text: "CURRICULUMS",
      },
      {
        link: "/admin/configs",
        text: "CONFIGURATIONS",
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
        <div className="admin-nav col-lg-3 bg-white s">
          <Card className="text-dark bg-white">
            <Nav
              variant="tabs"
              defaultActiveKey="/admin/intro"
              className="flex-column"
            >
              <div className="text-center">
                <img
                  className="logo img-fluid"
                  src="./../src/intros/logo.png"
                  alt="FIT TDC"
                  title="Khoa công nghệ thông tin- Trường cao đẳng Công nghệ Thủ Đức"
                />
              </div>

              {navbarItems &&
                navbarItems.map((item, index) => (
                  <NavItem
                    key={item.link}
                    onClick={handleNav}
                    data-link={item.link}
                    className={
                      "admin-nav-button text-decoration-none m-2 p-3 fw-bold" +
                      (activeIndex === index
                        ? " active s text-danger bg-white"
                        : "")
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {item.text}
                  </NavItem>
                ))}

              <hr />
              <Popconfirm
                title="Are you sure you want to logout?"
                okText="Confirm to logout?"
                cancelText="Cancel"
                onConfirm={handleLogout}
              >
                <button className=" m-2 p-3 mx-5 btn">LOGOUT</button>
              </Popconfirm>
            </Nav>
          </Card>
        </div>

        <div className="admin-content col-lg-9 py-3 px-5 bg-white s">
          {slot}
        </div>
      </div>
    </div>
  );
}
