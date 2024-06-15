import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import AdminLayout from "../../layouts/AdminLayout";
import { useNavigate } from "react-router";
import Modal from "react-bootstrap/Modal";
import { Parser } from "html-to-react";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const initPost = {
  id: 0,
  title: "Tiêu đề bài viết",
  content: "Đây là nội dung bài viết",
  likes: 0,
  views: 0,
  author: 1,
};

const initTag = {
  id: 0,
  name: "Danh mục",
};

const colors = [
  "outline-danger",
  "outline-secondary",
  "outline-success",
  "outline-warning",
  "outline-info",
  "outline-primary",
];

export default function EditPost() {
  const contentEditor = useRef();
  const title = useRef();
  const alertSuccess = useRef();
  const alertError = useRef();
  const submitButton = useRef();

  const nagivate = useNavigate();

  const [cursorPosition, setCursorPosition] = useState(0);
  const [show, setShow] = useState(false);

  const [post, setPost] = useState(() => {
    const post = window.history.state.usr ?? initPost();
    return post;
  });
  const [tags, setTags] = useState([initTag]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    return setShow(true);
  };

  useEffect(() => {
    post.tags = post.tags.map(tag => {
      return tag.id ?? tag;
    })
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/tags")
      .then((res) => res.json())
      .then((tags) => {
        setTags(tags);
      })
      .catch((err) => {
        console.log(err);
        setTags([initTag]);
      });
  }, []);

  function handleChoosingTag(id, target) {
    if (target.className.includes("active")) {
      target.classList.remove("active");

      post.tags = post.tags.filter((tag) => {
        return tag !== id;
      });
    } else {
      target.classList.add("active");

      post.tags.push(id);
    }
  }

  function processingSavePost() {
    submitButton.current.textContent = "Đang tải...";
    alertSuccess.current.textContent = "";
    alertError.current.innerHTML = "";

    const data = {
      ...post,
      title: title.current.value,
      author: 1,
    };

    fetch(`http://localhost:8000/api/posts/${post.id}`, {
      method: "PATCH", //PATCH
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        switch (data.status) {
          case 200:
            alertSuccess.current.textContent = data.message;
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

            alertError.current.innerHTML = message;
            break;
          default:
            alertError.current.innerHTML =
              "Đã có lỗi xảy ra. Cập nhật không thành công";
            break;
        }
      })
      .catch((err) => {
        console.log(err);
        alertError.current.innerHTML =
          "Đã có lỗi xảy ra. Cập nhật không thành công";
      })
      .finally(() => {
        submitButton.current.textContent = "Lưu thay đổi";
      });
  }

  function handleEditorChange(e) {
    // setPost(e.target.getContent());
    post.content = e.target.getContent();
    setPost(post);

    // Update cursor position
    const editor = contentEditor.current.editor;
    const selection = editor.selection.getRng();
    setCursorPosition(selection.startOffset);
  }

  // Function to restore cursor position
  function restoreCursorPosition() {
    const editor = contentEditor.current.editor;
    editor?.selection?.select(editor.getBody(), true);
    editor?.selection?.collapse(false);
    editor?.selection?.setRng(cursorPosition, cursorPosition);
  }

  // Call restoreCursorPosition after re-render
  useEffect(() => {
    restoreCursorPosition();
  });

  console.log(post);

  return (
    <>
      <AdminLayout
        slot={
          <div className="post-page">
            <div ref={alertSuccess} className="alert alert-success"></div>
            <div ref={alertError} className="alert alert-danger"></div>

            <div className="d-flex">
              <button
                onClick={() =>
                  window.confirm("Bỏ thay đổi?") && nagivate("./../")
                }
                className="btn btn-teal px-3 py-2"
                style={{ width: "auto" }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
              <span className="offset-md-10"></span>
              <button onClick={handleShow} className="btn btn-teal px-5">
                Xem
              </button>
            </div>
            <hr />

            <label className="py-2">
              <b>Danh mục bài viết (Tags)</b>
            </label>
            <br />
            {tags.map((tag) => (
              <button
                onClick={(e) => handleChoosingTag(tag.id, e.target)}
                className={
                  `btn btn-${colors[(tag.id - 1) % colors.length]}
                   m-1 
                   ${post.tags?.includes(tag.id) ? " active ": ""}`}
                key={tag.id}
              >
                <LocalOfferIcon />
                {tag.name}
              </button>
            ))}

            <div className="post-input-title mb-3">
              <label htmlFor="post-title" className="py-2">
                <b>Tiêu đề bài viết</b>
              </label>
              <h1>
                <input
                  required
                  ref={title}
                  placeholder="Tiêu đề bài viết"
                  type="text"
                  id="post-title"
                  className="form-control py-3"
                  defaultValue={post?.title}
                />
              </h1>
            </div>
            <div className="post">
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
              <div className="offset-md-10 col-md-2">
                <button
                  ref={submitButton}
                  onClick={processingSavePost}
                  className="tab-teal active mt-2"
                >
                  Lưu chỉnh sửa
                </button>
              </div>
            </div>
            <Modal show={show} onHide={handleClose} size="xl">
              <Modal.Header closeButton>
                <Modal.Title>{title.current?.value}</Modal.Title>
              </Modal.Header>
              <Modal.Body>{Parser().parse(post.content)}</Modal.Body>
              <Modal.Footer>
                <button className="btn btn-teal" onClick={handleClose}>
                  Close
                </button>
              </Modal.Footer>
            </Modal>
          </div>
        }
      ></AdminLayout>
    </>
  );
}
