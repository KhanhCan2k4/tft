import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";
import {
  Badge,
  CloseButton,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "react-bootstrap";
import { useNavigate } from "react-router";
import MultipleSelectTags from "../../../../components/ChooseTag";
import { apiURL } from "../../../../App";
import { Toast } from "primereact/toast";

export default function AdminPostCreate() {
  //refs
  const navigate = useNavigate();
  const contentEditor = useRef();
  const previewedImage = useRef();
  const toast = useRef();

  //states
  const [post, setPost] = useState({ title: "", content: "", tags: [], newTag: "" });
  const [cursorPosition, setCursorPosition] = useState(0);
  const [cover, setCover] = useState();

  // Call restoreCursorPosition after re-render
  useEffect(() => {
    restoreCursorPosition();
  }, []);

  //handlers
  function handleEditorChange(e) {
    setPost({ ...post, content: e.target.getContent() });

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

  function handleChangeImage(e) {
    const file = e.target?.files[0];
    setCover(file);
    previewedImage.current.src = URL.createObjectURL(file);
  }

  const handlePost = (e) => {
    e.target.style.display = "none";

    //validate
    if (!post.title) {
      toast.current.show({
        severity: "error",
        summary: "Create a Post",
        detail: "Title is required",
        life: 3000,
      });
      e.target.style.display = "unset";
      return;
    }

    if (!post.content) {
      toast.current.show({
        severity: "error",
        summary: "Create a Post",
        detail: "Content is required",
        life: 3000,
      });
      e.target.style.display = "unset";
      return;
    }

    // const formData = new FormData();
    // formData.append("title", post.title);
    // formData.append("content", post.content);
    // formData.append("tags", post.tags);
    // formData.append("newtag", post.newTag);
    // formData.append("image", cover);

    const api = apiURL + "posts";

    fetch(api, {
      method: "POST",
      headers: {"Content-Type": 'application/json'},
      body: JSON.stringify(post),
    })
      .catch((err) => {
        console.log("Create post", err);
        toast?.current?.show({
          severity: "error",
          summary: "Create a Post",
          detail: "Create a Post failed",
          life: 3000,
        });
        e.target.style.display = "unset";
      })
      .finally(() => {
        navigate("./..");
      });
  };

  return (
    <Modal show={true} size="xl">
      <Toast ref={toast} />
      <ModalHeader>
        <h5>CREATE NEW POST</h5>
        <CloseButton onClick={() => navigate("./..")} />
      </ModalHeader>

      <ModalBody>
        <Badge bg="danger">Title</Badge>
        <input
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          type="text"
          className="form-control my-2 fw-bold"
        />

        <div className="row">
          <div className="col-md-6">
            <Badge bg="danger">Cover</Badge>
            <input
              onChange={handleChangeImage}
              type="file"
              accept="image/*"
              className="form-control my-2"
            />

            <Badge bg="danger" className="mb-2">
              Tags
            </Badge>
            <MultipleSelectTags
              handleChooseTags={(tags) => setPost({ ...post, tags: tags })}
            />

            <Badge bg="danger" className="mb-2">
              New tag
            </Badge>
            <input
              onChange={(e) => setPost({ ...post, newTag: e.target.value })}
              type="text"
              className="form-control my-2"
              placeholder="Enter new tag"
            />
          </div>
          <div className="col-md-6">
            <Badge bg="danger">Preview</Badge>
            <img
              ref={previewedImage}
              src=""
              alt=""
              className="img-fluid mt-2"
            />
          </div>
        </div>

        <Badge bg="danger" className="mb-2">
          Content
        </Badge>
        <Editor
          ref={contentEditor}
          apiKey="8gjew3xfjqt5cu2flsa3nz2oqr4z5bru9hr3phl05rsfyss3"
          init={{
            plugins:
              "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker",
            toolbar:
              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
          }}
          onChange={handleEditorChange}
        />
      </ModalBody>

      <ModalFooter>
        <button onClick={handlePost} className="btn btn-danger">
          Post
        </button>
      </ModalFooter>
    </Modal>
  );
}
