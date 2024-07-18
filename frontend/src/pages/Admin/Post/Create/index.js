import { Editor } from "@tinymce/tinymce-react";
import { useContext, useEffect, useRef, useState } from "react";
import {
  CloseButton,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "react-bootstrap";
import { useNavigate } from "react-router";
import MultipleSelectTags from "../../../../components/ChooseTag";
import {
  apiURL,
  ConfigContext,
  editor_api_key,
  gemini_api_key,
} from "../../../../App";
import { Toast } from "primereact/toast";
import { Chip } from "@mui/material";
import { Button } from "antd";

export default function AdminPostCreate() {
  //refs
  const navigate = useNavigate();
  const contentEditor = useRef();
  const previewedImage = useRef();
  const toast = useRef();
  const aiRef = useRef();
  const configs = useContext(ConfigContext);

  //states
  const [post, setPost] = useState({
    title: "",
    content: "",
    tags: [],
    newTag: "",
  });
  const [cursorPosition, setCursorPosition] = useState(0);
  const [cover, setCover] = useState();
  const [templates, setTemplates] = useState([]);

  // Call restoreCursorPosition after re-render
  useEffect(() => {
    restoreCursorPosition();
  }, []);

  //fetch all templates
  useEffect(() => {
    const api = apiURL + "templates";

    fetch(api)
      .then((res) => res.json())
      .then((templates) => {
        setTemplates(templates);
      })
      .catch((err) => {
        console.log("fetch all templates failed", err);
      });
  }, []);

  //handlers
  function handleEditorChange(e) {
    setPost({ ...post, content: e.target.getContent() });
    getAiGeneratedText();

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

    if (!cover) {
      toast.current.show({
        severity: "error",
        summary: "Create a Post",
        detail: "Cover image is required",
        life: 3000,
      });
      e.target.style.display = "unset";
      return;
    }

    toast?.current?.show({
      severity: "confirm",
      summary: "Create a Post",
      detail: "Please wait for processing",
      life: 3000,
    });

    const api = apiURL + "posts";
    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    })
      .then((res) => res.json())
      .then((data) => {
        //handle image
        if (data && data.post) {
          const formData = new FormData();
          formData.append("image", cover);

          const api = apiURL + "posts/cover/" + data.post.id;
          fetch(api, {
            method: "POST",
            body: formData,
          }).finally(() => {
            navigate("./..");
          });
        } else {
          navigate("./..");
        }
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
      });
  };

  const getAiGeneratedText = () => {
    const api =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
      (configs?.find((config) => config.key === "GEMINI_API_KEY")?.value ||
        gemini_api_key);

    try {
      aiRef.current.textContent = "Generating content...";
    } catch (err) {}

    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  configs?.find((config) => config.key === "CREATE_POST_AI_PROMPT")
                    ?.value ||
                  "Viết lại đoạn văn dưới đây cho hay hơn: " +
                    (post && post.content),
              },
            ],
          },
        ],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        try {
          aiRef.current.textContent =
            data?.candidates[0]?.content?.parts[0]?.text;
        } catch (err) {}
      });
  };

  return (
    <Modal show={true} fullscreen={true} enforceFocus={false}>
      <Toast ref={toast} />
      <ModalHeader>
        CREATE NEW POST
        <CloseButton onClick={() => navigate("./..")} />
      </ModalHeader>

      <ModalBody style={{ backgroundColor: "rgba(100,100,100,0.1)" }}>
        <div className="row">
          <div className="col-md-3 bg-white py-4">
            <Chip label="Cover" />
            <input
              onChange={handleChangeImage}
              type="file"
              accept="image/*"
              className="form-control my-2"
            />

            <div className="col-6">
              <Chip label="Preview Cover" />

              <img
                ref={previewedImage}
                src="../../../src/posts/default.jpg"
                alt=""
                className="img-fluid mt-2"
              />
            </div>

            <Chip label="Tags" />
            <MultipleSelectTags
              handleChooseTags={(tags) => setPost({ ...post, tags: tags })}
            />

            <Chip label="New Tag" />
            <input
              onChange={(e) => setPost({ ...post, newTag: e.target.value })}
              type="text"
              className="form-control my-2"
              placeholder="Enter new tag"
            />

            <Chip label="Templates (Suggestion only)" />
            <br />
            <small>
              <i>
                As soon as you choose a template, the current content is no
                longer displayed
              </i>
            </small>
            <select
              onChange={(e) => {
                setPost({ ...post, content: e.target.value });
                contentEditor.current.editor.setContent(e.target.value);
              }}
              className="form-control"
            >
              {templates &&
                templates.map((template) => (
                  <option key={template.id} value={template.content}>
                    {template.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="col-md-9">
            <div className="row">
              <div className="col-12">
                <Chip label="Title" />
                <input
                  onChange={(e) => setPost({ ...post, title: e.target.value })}
                  type="text"
                  className="form-control my-2 fw-bold"
                />
              </div>

              <div className="col-12">
                <Chip label="Content" className="m-1" />

                <Editor
                  ref={contentEditor}
                  apiKey={
                    configs?.find((config) => config.key === "EDITOR_API_KEY")
                      ?.value ||
                    "8gjew3xfjqt5cu2flsa3nz2oqr4z5bru9hr3phl05rsfyss3"
                  }
                  init={{
                    height: 300,
                    plugins:
                      "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker",
                    toolbar:
                      "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                  }}
                  onChange={handleEditorChange}
                />
              </div>

              <div className="col-12">
                <Chip
                  label={
                    <b>
                      AI generator <i>(Suggestion only)</i>
                    </b>
                  }
                  className="m-1"
                />
                <textarea
                  readOnly={true}
                  ref={aiRef}
                  className="form-control"
                  rows={20}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter className="d-block text-center">
        <button className="btn text-danger" onClick={handlePost}>
          Post
        </button>
      </ModalFooter>
    </Modal>
  );
}
