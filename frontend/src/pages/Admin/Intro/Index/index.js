import { Badge, Modal } from "react-bootstrap";
import AdminLayout from "./../../../../layouts/AdminLayout/index";
import Banner from "../../../../components/Banner";
import { useEffect, useRef, useState } from "react";
import { apiURL } from "../../../../App";
import { imageURL } from "./../../../../App";
import { Editor } from "@tinymce/tinymce-react";
import { Toast } from "primereact/toast";

export default function AdminIntroIndex() {
  //refs
  const reviewedImage = useRef();
  const contentEditor = useRef();
  const toast = useRef();

  //states
  const [banners, setBanners] = useState([]);
  const [inputFiles, setInputFiles] = useState([]);
  const [newBannerInput, setNewBannerInput] = useState();
  const [post, setPost] = useState({ id: 1, title: "", body: "" });

  const [cursorPosition, setCursorPosition] = useState(0);

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

    fetch(`${apiURL}banners/${showedBanner.id}`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        switch (data.status) {
          case 200:
            setBanners(data.banners);
            break;
          case 422:
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

  //effects
  //get post
  useEffect(() => {
    const api = apiURL + "posts/1";

    fetch(api)
      .then((res) => res.json())
      .then((post) => {
        if (post) {
          post.title = "Bài viết giới thiệu";
          setPost(post);
        }
      })
      .catch((err) => {
        console.log("Fetch intro post", err);
      });
  }, []);

  //get all banners
  useEffect(() => {
    fetch(`${apiURL}banners`)
      .then((res) => res.json())
      .then((banners) => {
        setBanners(banners);
      })
      .catch((err) => {
        console.log("Fetch all banners", err);
      });
  }, []);

  useEffect(() => {
    const inputFiles = [];
    for (let i = banners.length + 1; i <= 6; i++) {
      inputFiles.push(
        <div key={i} className="mb-3">
          <h4>#{i}</h4>
          <input
            accept="image/*"
            onChange={handleInputImage}
            className="form-control"
            type="file"
          />
        </div>
      );
    }

    setInputFiles(inputFiles);
  }, [banners]);

  // Call restoreCursorPosition after re-render
  useEffect(() => {
    restoreCursorPosition();
  }, []);

  //handles
  function handleInputImage(e) {
    const file = e.target?.files[0];

    const formData = new FormData();
    formData.append("img", file);

    fetch(`${apiURL}banners`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        switch (data.status) {
          case 200:
            setBanners([...banners, data.banner]);
            toast.current.show({
              severity: "success",
              summary: "Input banner",
              detail: "Input banner successfully",
              life: 3000,
            });
            break;
          case 422:
            toast.current.show({
              severity: "error",
              summary: "Input banner",
              detail: "Input banner failed",
              life: 3000,
            });
            break;
          default:
            toast.current.show({
              severity: "error",
              summary: "Input banner",
              detail: "Input banner failed",
              life: 3000,
            });
            break;
        }
      })
      .catch((err) => {
        console.log("Input banner failed", err);
        toast.current.show({
          severity: "error",
          summary: "Input banner",
          detail: "Input banner failed",
          life: 3000,
        });
      });
  }

  function handleChangeImage(e) {
    const file = e.target?.files[0];
    reviewedImage.current.src = URL.createObjectURL(file);

    setNewBannerInput(file);
  }

  function handelPriority(priority, id) {
    fetch(`${apiURL}/banners/${id}/${priority}`)
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
    fetch(`${apiURL}banners/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        switch (data.status) {
          case 200:
            setBanners(data.banners);
            toast.current.show({
              severity: "success",
              summary: "Remove banner",
              detail: "Remove banner successfully",
              life: 3000,
            });
            break;
          default:
            toast.current.show({
              severity: "error",
              summary: "Remove banner",
              detail: "Remove banner failed",
              life: 3000,
            });
            break;
        }
      })
      .catch((err) => {
        console.log("Remove banner failed", err);
        toast.current.show({
          severity: "error",
          summary: "Remove banner",
          detail: "Remove banner failed",
          life: 3000,
        });
      });
  }

  function handleEditorChange(e) {
    post.content = e.target?.getContent();
    setPost(post);

    // Update cursor position
    const editor = contentEditor.current?.editor;
    const selection = editor?.selection?.getRng();
    setCursorPosition(selection?.startOffset);
  }

  // Function to restore cursor position
  function restoreCursorPosition() {
    const editor = contentEditor.current?.editor;
    editor?.selection?.select(editor?.getBody(), true);
    editor?.selection?.collapse(false);
    editor?.selection?.setRng(cursorPosition, cursorPosition);
  }

  const handleUpdatePost = (e) => {
    e.target.textContent = "Loanding...";

    const api = apiURL + "posts/1";

    fetch(api, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    })
      .then((res) => res.json())
      .then((data) => {
        switch (data.status) {
          case 200:
            setPost(post);
            toast.current.show({
              severity: "success",
              summary: "Update Intro post",
              detail: "Update Intro post successfully",
              life: 3000,
            });
            break;
          default:
            toast.current.show({
              severity: "error",
              summary: "Update Intro post",
              detail: "Update Intro post failed",
              life: 3000,
            });
            break;
        }
      })
      .catch((err) => {
        console.log("Intro post", err);
        toast.current.show({
          severity: "error",
          summary: "Update Intro post",
          detail: "Update Intro post failed",
          life: 3000,
        });
      })
      .finally(() => {
        e.target.textContent = "Save changes";
      });
  };

  return (
    <AdminLayout
      slot={
        <div className="admin-intro-index">
          <Toast ref={toast} />
          <h1>ADMINISTRATION - INTRO POST</h1>

          <div className="intro-post">
            <div className="row">
              <div className="col">
                <Badge bg="danger">INTRO POST</Badge>
              </div>
              <div className="col text-end">
                <button
                  onClick={handleUpdatePost}
                  className="btn btn-outline-danger"
                >
                  Save changes
                </button>
              </div>
            </div>

            <div className="intro-post-container">
              <input
                className="form-control my-2 fw-bold"
                readOnly
                value={"Bài viết giới thiệu"}
              />

              <Editor
                ref={contentEditor}
                apiKey="8gjew3xfjqt5cu2flsa3nz2oqr4z5bru9hr3phl05rsfyss3"
                init={{
                  plugins:
                    "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker",
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                }}
                initialValue={post?.content}
                onChange={handleEditorChange}
              />
            </div>
          </div>

          <div className="banners mt-3">
            <Badge bg="danger">BANNERS</Badge>
            <div className="banner-container">
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

            {inputFiles.length > 0 && <div>{inputFiles}</div>}
          </div>

          <Modal show={show} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
              <Modal.Title>CHANGE BANNER</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <div className="text-start my-3">
                <Badge bg="danger">Old Image</Badge>
              </div>
              <img
                style={{ width: "50%" }}
                src={
                  showedBanner &&
                  showedBanner.img &&
                  imageURL + showedBanner.img
                }
                alt=""
              />

              <br />
              <br />

              <div className="text-start my-3">
                <Badge bg="danger">New Image</Badge>
              </div>
              <input
                accept="image/*"
                onChange={(e) => handleChangeImage(e)}
                className="form-control"
                type="file"
              />
              <br />

              <div className="text-start my-3">
                <Badge bg="danger">Preview</Badge>
              </div>
              <img ref={reviewedImage} style={{ width: "50%" }} alt="" />
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-danger" onClick={handleClose}>
                Save changes
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      }
    />
  );
}
