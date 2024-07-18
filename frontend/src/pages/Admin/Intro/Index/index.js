import { Badge, CloseButton, Modal } from "react-bootstrap";
import AdminLayout from "./../../../../layouts/AdminLayout/index";
import Banner from "../../../../components/Banner";
import { useContext, useEffect, useRef, useState } from "react";
import { apiURL, ConfigContext } from "../../../../App";
import { imageURL } from "./../../../../App";
import { Editor } from "@tinymce/tinymce-react";
import { Toast } from "primereact/toast";
import { Chip } from "@mui/material";
import { Button } from "antd";
import { FileArrowUpFill } from "react-bootstrap-icons";

export default function AdminIntroIndex() {
  //refs
  const reviewedImage = useRef();
  const contentEditor = useRef();
  const toast = useRef();
  const configs = useContext(ConfigContext);

  //states
  const [banners, setBanners] = useState([]);
  const [inputFiles, setInputFiles] = useState([]);
  const [newBannerInput, setNewBannerInput] = useState();
  const [post, setPost] = useState({ id: 1, title: "", body: "" });

  const [cursorPosition, setCursorPosition] = useState(0);

  const [show, setShow] = useState(false);
  const [showedBanner, setShowedBanner] = useState(banners[0]);

  const handleClose = (e) => {
    if (!newBannerInput) {
      toast?.current?.show({
        severity: "error",
        summary: "Upload banner",
        detail: "New banner is not available",
        life: 3000,
      });
      return;
    }

    if (e && e.target) {
      e.target.textContent = "Loading...";
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

  //set title
  useEffect(() => {
    document.title = "Administration Introduction";
  }, []);

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
    for (let i = banners.length + 1; i <= 10; i++) {
      inputFiles.push(
        <div key={i} className="mb-3 d-inline-block mx-2">
          <div className="mt-2">
            <label htmlFor="upload">
              <span className="btn" aria-hidden={true}>
                <b># {i}</b>

                <FileArrowUpFill />
              </span>
              <input
                type="file"
                onChange={handleInputImage}
                accept="image/png, image/gif, image/jpeg"
                id="upload"
                style={{ display: "none" }}
              />
            </label>
          </div>
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
                <button onClick={handleUpdatePost} className="btn text-danger">
                  Save changes
                </button>
              </div>
            </div>

            <div className="intro-post-container">
              <input
                className="form-control my-2 fw-bold"
                disabled
                value={"Bài viết giới thiệu"}
              />

              <Editor
                ref={contentEditor}
                apiKey={
                  configs?.find((config) => config.key === "EDITOR_API_KEY")
                    ?.value ||
                  "8gjew3xfjqt5cu2flsa3nz2oqr4z5bru9hr3phl05rsfyss3"
                }
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
            <div className="banner-container row">
              {banners &&
                banners.map((banner) => (
                  <div key={banner.id} className="col-md-6">
                    <Banner
                      banner={banner}
                      handleShow={handleShow}
                      handleDelete={handleDelete}
                      handelPriority={handelPriority}
                    />
                  </div>
                ))}
            </div>

            {inputFiles.length > 0 && <div>{inputFiles}</div>}
          </div>

          <Modal show={show} onHide={() => setShow(false)} size="xl">
            <Modal.Header>
              CHANGE BANNER
              <CloseButton onClick={() => setShow(false)} />
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="col-md-6">
                  <Chip className="m-1" label={<b>Old Image</b>} />
                  <br />

                  <img
                    style={{ width: "90%" }}
                    src={
                      showedBanner &&
                      showedBanner.img &&
                      imageURL + showedBanner.img
                    }
                    alt="Old Banner"
                  />
                </div>

                <div className="col-md-6">
                  <Chip className="m-1" label={<b>New Image</b>} />
                  <br />

                  <img
                    ref={reviewedImage}
                    style={{ width: "90%" }}
                    alt="New Banner"
                  />

                  <div className="mt-2">
                    <label htmlFor="upload-change">
                      <span className="btn" aria-hidden={true}>
                        <FileArrowUpFill />
                      </span>
                      <input
                        type="file"
                        onChange={(e) => handleChangeImage(e)}
                        accept="image/png, image/gif, image/jpeg"
                        id="upload-change"
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button className="text-danger btn" onClick={handleClose}>
                Save changes
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      }
    />
  );
}
