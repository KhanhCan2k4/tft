import { NavLink } from "react-router-dom";
import "./styles.css";

export default function NavBar() {
  return (
    <div className="my-navbar">
      <ul className="nav justify-content-center fixed-top">
        <li className="nav-item">
          <NavLink to="/intro" className="nav-logo" aria-current="page">
            <img
              className="img-fluid"
              src="./src/intros/logo.png"
              alt="Logo Khoa CNTT"
            />
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/" className="nav-link" aria-current="page">
            Trang chủ
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/tuyen-sinh" className="nav-link">
            Tuyển sinh
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/sinh-vien" className="nav-link">
            Dành cho sinh viên
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/vinh-danh" className="nav-link">
            Vinh danh
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/lien-he" className="nav-link">
            Liên hệ
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
