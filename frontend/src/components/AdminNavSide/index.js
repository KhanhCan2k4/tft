import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Groups2Icon from "@mui/icons-material/Groups2";
import ListItemText from "@mui/material/ListItemText";
import PostAddIcon from "@mui/icons-material/PostAdd";
import GroupIcon from "@mui/icons-material/Group";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TagIcon from "@mui/icons-material/Tag";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import OtherHousesIcon from "@mui/icons-material/OtherHouses";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function NavSide() {
  const nagivate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("email");
    Cookies.remove("remember_token");

    nagivate("/login");
  };

  return (
    <div className="nav-side p-4" style={{ minWidth: "300px" }}>
      <h2 className="text-teal">Quản trị</h2>
      <hr />
      <List>
        {/* intro */}
        <ListItem disablePadding className="list-item">
          <NavLink to={"/admin/intro"}>
            <ListItemButton>
              <ListItemIcon>
                <TagIcon />
              </ListItemIcon>
              <ListItemText primary="Intro Post" />
            </ListItemButton>
          </NavLink>
        </ListItem>

        <ListItem disablePadding className="list-item">
          <NavLink to={"/quan-tri/cong-dong"}>
            <ListItemButton>
              <ListItemIcon>
                <Groups2Icon />
              </ListItemIcon>
              <ListItemText primary="Cộng Đồng" />
            </ListItemButton>
          </NavLink>
        </ListItem>

        <ListItem disablePadding className="list-item">
          <NavLink to={"/quan-tri/banner"}>
            <ListItemButton>
              <ListItemIcon>
                <ViewCarouselIcon />
              </ListItemIcon>
              <ListItemText primary="Banner" />
            </ListItemButton>
          </NavLink>
        </ListItem>

        <ListItem disablePadding className="list-item">
          <NavLink to={"/quan-tri/danh-muc"}>
            <ListItemButton>
              <ListItemIcon>
                <LocalOfferIcon />
              </ListItemIcon>
              <ListItemText primary="Danh mục" />
            </ListItemButton>
          </NavLink>
        </ListItem>

        <ListItem disablePadding className="list-item">
          <NavLink to={"/quan-tri/bai-viet"}>
            <ListItemButton>
              <ListItemIcon>
                <PostAddIcon />
              </ListItemIcon>
              <ListItemText primary="Bài viết" />
            </ListItemButton>
          </NavLink>
        </ListItem>

        <ListItem disablePadding className="list-item">
          <NavLink to={"/quan-tri/lien-he"}>
            <ListItemButton>
              <ListItemIcon>
                <ContactMailIcon />
              </ListItemIcon>
              <ListItemText primary="Tiếp nhận liên hệ" />
            </ListItemButton>
          </NavLink>
        </ListItem>

        <ListItem disablePadding className="list-item">
          <NavLink to={"/quan-tri/thanh-vien"}>
            <ListItemButton>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Thành viên" />
            </ListItemButton>
          </NavLink>
        </ListItem>

        <ListItem disablePadding className="list-item">
          <NavLink to={"/quan-tri/cai-dat"}>
            <ListItemButton>
              <ListItemIcon>
                <SettingsApplicationsIcon />
              </ListItemIcon>
              <ListItemText primary="Cài đặt" />
            </ListItemButton>
          </NavLink>
        </ListItem>

        <hr />
        <ListItem disablePadding className="list-item">
          <div onClick={handleLogout}>
            <ListItemButton>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Đăng xuất" />
            </ListItemButton>
          </div>
        </ListItem>
      </List>
    </div>
  );
}
