import { useEffect, useState } from "react";
import PostAddIcon from "@mui/icons-material/PostAdd";
import GroupIcon from "@mui/icons-material/Group";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TagIcon from "@mui/icons-material/Tag";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import AdminLayout from "./../../layouts/AdminLayout/index";
import DashBoardItem from "../../components/AdminDashboardItem";
import { NavLink } from "react-router-dom";

export function Index() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const myItems = [
      {
        link: "/quan-tri/gioi-thieu",
        icon: <TagIcon />,
        title: "Giới thiệu",
        style: "brown",
      },
      {
        link: "/quan-tri/banner",
        icon: <ViewCarouselIcon />,
        title: "Banner",
        style: "cadetblue",
      },
      {
        link: "/quan-tri/danh-muc",
        icon: <LocalOfferIcon />,
        title: "Danh mục",
        style: "chocolate",
      },
      {
        link: "/quan-tri/bai-viet",
        icon: <PostAddIcon />,
        title: "Bài viết",
        style: "darkblue",
      },
      {
        link: "/quan-tri/lien-he",
        icon: <ContactMailIcon />,
        title: "Tiếp nhận liên hệ",
        style: "darkgreen",
      },
      {
        link: "/quan-tri/thanh-vien",
        icon: <GroupIcon />,
        title: "Thành viên",
        style: "darkmagenta",
      },
      {
        link: "/quan-tri/cai-dat",
        icon: <SettingsApplicationsIcon />,
        title: "Cài đặt",
        style: "lightslategrey",
      },
    ];

    setItems(myItems);
  }, []);

  return (
    <AdminLayout
      slot={
        <>
          <h1 className="text-teal fw-bold">Quản trị</h1>
          <hr />
          <div className="admin-content">
            <div className="row">
              {items.map((item, index) => (
                <div key={index} className="col-md-4">
                  <NavLink to={item.link}>
                    <DashBoardItem
                      icon={item.icon}
                      title={item.title}
                      style={item.style}
                    />
                  </NavLink>
                </div>
              ))}
            </div>
          </div>
        </>
      }
    ></AdminLayout>
  );
}
