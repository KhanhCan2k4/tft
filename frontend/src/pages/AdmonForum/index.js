import { useEffect, useRef, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { apiURL, imageURL, slug } from "../../App";
import { Link } from "react-router-dom";
import {
  CloseButton,
  Form,
  InputGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import { Avatar, AvatarGroup } from "@mui/material";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import Groups3Icon from "@mui/icons-material/Groups3";
import LockResetIcon from "@mui/icons-material/LockReset";

export default function AdminForumPage() {
  const [forums, setForums] = useState([]);
  const [activeId, setActiveId] = useState(0);

  const modal = useRef();
  const createModal = useRef();

  const [show, setShow] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const toast = useRef(null);

  const accept = () => {
    toast.current.show({
      severity: "info",
      summary: "Confirmed",
      detail: "You have accepted",
      life: 3000,
    });

    handleDelete(forums[activeId]?.id);
  };

  const reject = () => {
    toast.current.show({
      severity: "warn",
      summary: "Rejected",
      detail: "You have rejected",
      life: 3000,
    });
  };

  const confirm1 = (event) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Are you sure you want to proceed?",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept,
      reject,
    });
  };

  const handleClose = (e) => {
    const id = +e.target.value;
    const api = apiURL + "forums/" + id;

    e.target.textContent = "Đang tải...";

    const file = document.querySelector("#forum-image-file-v")?.files[0];
    const name = document.querySelector("#forum-name-v")?.value;
    const _public = +document.querySelector("#forum-status-v")?.value;

    const formData = new FormData();
    formData.append("cover", file);
    formData.append("name", name);
    formData.append("public", _public);

    console.log(file);

    fetch(api, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        switch (data.status) {
          case 200:
            alert(data.message);
            e.target.remove();
            getForumsFromDatabase();
            setShow(false);
            break;
          case 422:
            const messages = data.message;
            let message = "";

            messages?.title?.forEach((err) => {
              message += err + "<br/>";
              console.log(message);
            });

            messages?.content?.forEach((err) => {
              message += err + "<br/>";
              console.log(message);
            });

            alert(message);
            break;
          default:
            alert("Đã có lỗi xảy ra. Thêm bài viết không thành công");
            break;
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Đã có lỗi xảy ra. Thêm bài viết không thành công");
      });
  };

  const handleShow = (e) => {
    const id = +e.target.value ?? 0;

    setActiveId(id);
    setShow(true);
  };

  useEffect(() => {
    const inputFileView = document.getElementById("forum-image-file-v");
    const imgView = document.getElementById("forum-img-v");
    const inputFileCreate = document.getElementById("forum-image-file");
    const imgCreate = document.getElementById("forum-img");

    inputFileView?.addEventListener("change", () => {
      const file = inputFileView.files[0];
      imgView.src = URL.createObjectURL(file);
    });

    inputFileCreate?.addEventListener("change", () => {
      const file = inputFileCreate.files[0];
      imgCreate.src = URL.createObjectURL(file);
    });
  });

  //fetch forums
  useEffect(() => {
    getForumsFromDatabase();
  }, []);

  const getForumsFromDatabase = () => {
    const api = apiURL + "forums";

    fetch(api)
      .then((res) => res.json())
      .then((forums) => setForums(forums))
      .catch((err) => {
        console.log(err);
        setForums([]);
      });
  };

  const handleDelete = (id) => {
    if (!id) {
      return;
    }

    //notify all users in this forum

    //delete
    const api = apiURL + "forums/" + id;

    fetch(api, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((data) => {
        switch (data.status) {
          case 200:
            toast.current.show({
              severity: "success",
              summary: "Cập nhật",
              detail: data.message,
              life: 3000,
            });
            break;
          default:
            toast.current.show({
              severity: "danger",
              summary: "Cập nhật",
              detail: "Cập nhật không thành công",
              life: 3000,
            });
            break;
        }
      })
      .catch((err) => {
        console.log(err);
        toast.current.show({
          severity: "danger",
          summary: "Cập nhật",
          detail: "Cập nhật không thành công",
          life: 3000,
        });
      })
      .finally(() => {
        getForumsFromDatabase();
      });
  };

  const handleCreateForum = (e) => {
    const api = apiURL + "forums";

    e.target.textContent = "Đang tải...";

    const file = document.querySelector("#forum-image-file")?.files[0];

    const formData = new FormData();
    formData.append("cover", file);
    formData.append("name", document.querySelector("#forum-name")?.value);
    formData.append("public", +document.querySelector("#forum-status")?.value);

    fetch(api, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        switch (data.status) {
          case 200:
            alert(data.message);
            e.target.remove();
            getForumsFromDatabase();
            setShowCreate(false);
            break;
          case 422:
            const messages = data.message;
            let message = "";

            messages?.title?.forEach((err) => {
              message += err + "<br/>";
              console.log(message);
            });

            messages?.content?.forEach((err) => {
              message += err + "<br/>";
              console.log(message);
            });

            alert(message);
            break;
          default:
            alert("Đã có lỗi xảy ra. Thêm bài viết không thành công");
            break;
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Đã có lỗi xảy ra. Thêm bài viết không thành công");
      });
  };

  const saveLink = (e) => {
    const link = e.target?.textContent ?? "";
    navigator.clipboard.writeText(link);

    toast.current.show({
      severity: "info",
      summary: "Lưu link cộng đồng",
      detail: "Đã lưu `" + link + "` vào clipboard",
      life: 3000,
    });
  };

  return (
    <AdminLayout
      slot={
        <div className="admin-forum-page">
          <button
            onClick={() => setShowCreate(true)}
            className="btn btn-teal my-3 ms-2"
          >
            Thêm cộng đồng mới
          </button>
          <table className="table table-striped">
            <thead>
              <tr className="fw-bold">
                <td>CỘNG ĐỒNG</td>
                <td>Trạng thái</td>
                <td>Ngày tạo</td>
                <td>Ngày cập nhật</td>
                <td></td>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {forums &&
                forums.map((forum, index) => (
                  <tr key={index}>
                    <td className="ps-md-5" style={{ width: "35%" }}>
                      <img
                        style={{ width: "25%" }}
                        src={
                          (forum.cover && imageURL + forum["cover"]) ||
                          "../src/forums/default.jpg"
                        }
                        className="img-fluid rounded-top"
                        alt=""
                      />
                      &ensp;
                      <b>{forum["name"]}</b>
                    </td>
                    <td className="text-center">
                      {forum.public === 1 ? (
                        <span className="text-warning">
                          <Groups3Icon />
                          <p>
                            <b>
                              <i>CÔNG KHAI</i>
                            </b>
                          </p>
                        </span>
                      ) : (
                        <span className="text-secondary">
                          <LockResetIcon />
                          <p>
                            <b>
                              <i>RIÊNG TƯ</i>
                            </b>
                          </p>
                        </span>
                      )}
                    </td>
                    <td>{forum["created_at"]}</td>
                    <td>{forum["updated_at"] || "Chưa có ngày cập nhật"}</td>
                    <td style={{ width: "10%" }}>
                      <div className="row">
                        <div className="col-12">
                          <button
                            style={{ width: "100%" }}
                            value={index}
                            onClick={handleShow}
                            className="my-1 btn btn-outline-success me-2"
                          >
                            Xem chi tiết
                          </button>
                        </div>
                        <div className="col-12">
                          <button
                            style={{ width: "100%" }}
                            value={forum.id}
                            onClick={(e) => {
                              return (
                                (() => {
                                  setActiveId(index);
                                  return true;
                                })() && confirm1(e)
                              );
                            }}
                            className="my-1 btn btn-outline-danger"
                          >
                            Xoá
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <Modal
            className="view-modal"
            ref={modal}
            show={show}
            onHide={() => setShow(false)}
            size="xl"
          >
            <ModalHeader>
              <b>{forums[activeId]?.name}</b>
            </ModalHeader>
            <ModalBody>
              <b>{"Tên cộng đồng"}</b>
              <input
                id="forum-name-v"
                className="form-control my-2"
                type="text"
                defaultValue={forums[activeId]?.name}
              />

              <b>{"Link của cộng đồng"}</b>
              <button
                onClick={saveLink}
                className="text-start px-3 py-2 btn link-primary btn-white form-control"
              >
                {`${window.location.protocol}//${window.location.hostname}:${
                  window.location.port
                }/cong-dong/link/${slug(forums[activeId]?.name)}/${
                  forums[activeId]?.id
                }`}
              </button>

              <div className="row">
                <div className="col-md-6">
                  <img
                    id="forum-img-v"
                    className="img-fluid"
                    alt={forums[activeId]?.name}
                    src={
                      (forums[activeId]?.cover &&
                        imageURL + forums[activeId]?.cover) ||
                      "../src/forums/default.jpg"
                    }
                  />
                </div>
                <div className="col-md-6">
                    
                </div>
              </div>

              <input
                id="forum-image-file-v"
                className="form-control mt-2"
                type="file"
                accept="image/*"
                placeholder="Chọn hình cho cộng động"
              />

              <b>{"Trạng thái"}</b>
              <select
                className="form-control my-2"
                id="forum-status-v"
                defaultValue={forums[activeId]?.public}
              >
                <option
                  defaultChecked={forums[activeId]?.public === 1}
                  value={1}
                >
                  Công khai
                </option>
                <option
                  defaultChecked={forums[activeId]?.public === 0}
                  value={0}
                >
                  Riêng tư
                </option>
              </select>

              <AvatarGroup total={forums[activeId]?.users.length}>
                {forums[activeId]?.users &&
                  forums[activeId]?.users.map((user) => (
                    <Avatar alt={user.name} src={imageURL + user?.avatar} />
                  ))}
              </AvatarGroup>
            </ModalBody>
            <ModalFooter>
              <button
                value={forums[activeId]?.id}
                className="btn btn-teal"
                onClick={handleClose}
              >
                Close
              </button>
            </ModalFooter>
          </Modal>

          <Modal
            className="create-modal"
            ref={createModal}
            show={showCreate}
            onHide={() => setShowCreate(false)}
            size="xl"
          >
            <ModalHeader>
              <b>{"Thêm cộng đồng mới"}</b>
            </ModalHeader>
            <ModalBody>
              <b>{"Tên cộng đồng"}</b>
              <input
                id="forum-name"
                className="form-control my-2"
                type="text"
              />
              <img
                id="forum-image"
                style={{
                  width: "25%",
                  height: "auto",
                  display: "inline-block",
                }}
                alt={"Ảnh cộng đồng mạc định"}
                title="Ảnh cộng đồng mạc định"
                src={"../src/forums/default.jpg"}
              />
              <input
                id="forum-image-file"
                className="form-control mt-2"
                type="file"
                placeholder="Chọn hình cho cộng động"
              />

              <b>{"Trạng thái"}</b>
              <select className="form-control my-2" id="forum-status">
                <option value={1}>Công khai</option>
                <option value={0}>Riêng tư</option>
              </select>

              <AvatarGroup total={forums[activeId]?.users.length}>
                {forums[activeId]?.users &&
                  forums[activeId]?.users.map((user) => (
                    <Avatar alt={user.name} src={imageURL + user?.avatar} />
                  ))}
              </AvatarGroup>
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-teal" onClick={handleCreateForum}>
                Thêm cộng đồng
              </button>
            </ModalFooter>
          </Modal>

          <Toast ref={toast} />
          <ConfirmPopup />
        </div>
      }
    ></AdminLayout>
  );
}
