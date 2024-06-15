import { useEffect, useRef, useState } from "react";
import AdminLayout from "./../../layouts/AdminLayout/index";
import Banner from "../../components/Banner";
import Modal from "react-bootstrap/Modal";

const initBanner = {
  id: 0,
  title: "Banner",
  img: "banner.jpg",
  priority: 1,
};

export default function AdminBanner() {
  const [banners, setBanners] = useState([initBanner]);
  const [inputFiles, setInputFiles] = useState([]);

  const alertSuccess = useRef();
  const alertDanger = useRef();
  const reviewedImage = useRef();

  const [newBannerInput, setNewBannerInput] = useState();

  const [show, setShow] = useState(false);
  const [showedBanner, setShowedBanner] = useState(banners[0]);

  const handleClose = (e) => {
    if (e && e.target) {
      e.target.textContent = "Đang tải...";
    }

    if (!newBannerInput) {
      setShow(false);
      return;
    }

    const formData = new FormData();
    formData.append("img", newBannerInput);

    fetch(`http://localhost:8000/api/banners/${showedBanner.id}`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        switch (data.status) {
          case 200:
            alertSuccess.current.textContent = data.message;
            setBanners(data.banners);
            break;
          case 422:
            alertDanger.current.textContent = data.message;
            break;
          default:
            break;
        }
      });

    setShow(false);
  };
  const handleShow = (banner) => {
    setShowedBanner(banner);
    return setShow(true);
  };

  useEffect(() => {
    fetch(`http://localhost:8000/api/banners`)
      .then((res) => res.json())
      .then((banners) => {
        setBanners(banners);
      })
      .catch((err) => {
        console.log(err);
        setBanners([initBanner]);
      });
  }, []);

  useEffect(() => {
    const inputFiles = [];
    for (let i = banners.length + 1; i <= 10; i++) {
      inputFiles.push(
        <div key={i} className="mb-3">
          <h4>#{i}</h4>
          <input
            accept="image/*"
            onChange={(e) => handleInputImage(e)}
            className="form-control"
            type="file"
          />
        </div>
      );
    }

    setInputFiles(inputFiles);
  }, [banners]);

  function handleInputImage(e) {
    const file = e.target?.files[0];

    const formData = new FormData();
    formData.append("img", file);

    fetch(`http://localhost:8000/api/banners`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        switch (data.status) {
          case 200:
            setBanners([...banners, data.banner]);
            break;
          case 422:
            alertDanger.current.textContent = data.message;
            break;
          default:
            break;
        }
      });
  }

  function handleChangeImage(e) {
    const file = e.target?.files[0];
    reviewedImage.current.src = URL.createObjectURL(file);

    setNewBannerInput(file);
  }

  function handelPriority(priority, id) {
    fetch(`http://localhost:8000/api/banners/${id}/${priority}`)
      .then((res) => res.json())
      .then((data) => {
        switch (data.status) {
          case 200:
            setBanners(data.banners);
            break;
          default:
            break;
        }
      });
  }

  function handleDelete(id) {
    alertSuccess.current.textContent = "";
    alertDanger.current.textContent = "";

    if (window.confirm("Xoá ảnh này?")) {
      fetch(`http://localhost:8000/api/banners/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          switch (data.status) {
            case 200:
              alertSuccess.current.textContent = data.message;
              setBanners(data.banners);
              break;
            default:
              break;
          }
        });
    }
  }


  return (
    <AdminLayout
      slot={
        <div className="admin-banner">
          <h1>Quản lý các Banner</h1>

          <div ref={alertSuccess} className="alert alert-success"></div>
          <div ref={alertDanger} className="alert alert-danger"></div>

          <div className="row">
            <div className="col">
              {banners &&
                banners.map((banner) => (
                  <Banner
                    key={banner.id}
                    banner={banner}
                    handleShow={handleShow}
                    handleDelete={handleDelete}
                    handelPriority={handelPriority}
                  />
                ))}
            </div>

            {inputFiles.length > 0 && (
              <div className="col">
                {inputFiles}
              </div>
            )}
          </div>

            {inputFiles.length > 0 && <div className="col">{inputFiles}</div>}

          <Modal show={show} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
              <Modal.Title>Thay ảnh</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <h5 className="text-start">Ảnh cũ</h5>
              <img
                style={{ width: "50%" }}
                src={"http://localhost:8000/" + showedBanner.img}
                alt=""
              />

              <br />
              <br />

              <h5 className="text-start">Ảnh mới</h5>
              <input
                accept="image/*"
                onChange={(e) => handleChangeImage(e)}
                className="form-control"
                type="file"
              />
              <br />

              <h5 className="text-start">Xem trước</h5>
              <img ref={reviewedImage} style={{ width: "50%" }} alt="" />
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-teal" onClick={handleClose}>
                Lưu
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      }
    ></AdminLayout>
  );
}
