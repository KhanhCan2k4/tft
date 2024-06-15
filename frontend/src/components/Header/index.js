import { Link , NavLink} from 'react-router-dom';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import logo from "../../logo.png";

export default function Header() {
    return (
        <>
        <header>
            <nav className="navbar navbar-expand-sm navbar-dark bg-s-nav fixed-top">
                <div className="container">
                    <NavLink className="navbar-brand" to="/">
                        <div className="logo ps-4">
                            <img height={"50px"} src={logo} alt="Logo Khoa Công nghệ Thông Tin - trường Cao đẳng Công nghệ Thủ Đức" />
                        </div>
                    </NavLink>
                    <button
                        className="navbar-toggler d-lg-none"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsibleNavId"
                        aria-controls="collapsibleNavId"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="collapsibleNavId">
                        <ul className="navbar-nav mx-auto mt-2 mt-lg-0">

                            <li className="nav-item">
                                <NavLink className="nav-link" to="/"><b>Trang chủ</b></NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink className="nav-link" to="/gioi-thieu"><b>Giới thiệu</b></NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink className="nav-link" to="/tuyen-sinh"><b>Tuyển sinh</b></NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink className="nav-link" to="/tot-nghiep"><b>Sinh viên</b></NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink className="nav-link" to="/vinh-danh"><b>Vinh danh</b></NavLink>
                            </li>
                        </ul>
                        <form className="d-flex my-2 my-lg-0">
                            <input
                                className="form-control me-sm-2"
                                type="text"
                                placeholder="Search"
                            />
                            <button
                                className="btn btn-outline-teal my-2 my-sm-0"
                                type="submit"
                            >
                                <SavedSearchIcon />
                            </button>
                        </form>
                    </div>
                </div>
            </nav>
        </header>
        </>
    )
};