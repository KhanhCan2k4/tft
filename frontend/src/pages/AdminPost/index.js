import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import AdminLayout from "../../layouts/AdminLayout";
import { useNavigate } from "react-router";

const initPost = {
  id: 0,
  title: "Tiêu đề bài viết",
  content: "Đây là nội dung bài viết",
  likes: 0,
  views: 0,
};

const id = 1;

export default function AdminPostPage() {
  const reviewTab = useRef();
  const editTab = useRef();
  const contentEditor = useRef();

  const nagivate = useNavigate();

  const [cursorPosition, setCursorPosition] = useState(0);

  const [post, setPost] = useState(initPost);
  const [tab, setTab] = useState(reviewTab);

  if (tab === reviewTab) {
    getPostFromDatabase();
  }

  function changeTab(target) {
    reviewTab.current.className = "tab-teal";
    editTab.current.className = "tab-teal";

    target.current.className = "tab-teal active";

    setTab(target);
  }

  function getPostFromDatabase() {
    fetch(`http://localhost:8000/api/posts/${id}`)
      .then((res) => res.json())
      .then((post) => {
        setPost(post);
      })
      .catch((err) => {
        nagivate("/quan-tri");
      });
  }

  function processingEditPost() {
    console.log(JSON.stringify(post));
    //save edit
    // post1 = post;
    fetch(`http://localhost:8000/api/posts/${id}`, {
      method: "PATCH", //PATCH
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    })
      .then((res) => {
        console.log(res);
        console.log("Update successfully");
      })
      .catch((err) => {
        console.log(err);
        console.log("Update unsuccessfully");
      });

    alert("Lưu thay đổi thành công");
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
  }, []);

  return (
    <>
      <AdminLayout
        slot={
          <div className="post-page">
            <h1>
              <b>Bài viết giới thiệu</b>
            </h1>

            <div className="offset-md-9 col-md-3 d-flex">
              <button
                ref={reviewTab}
                onClick={() =>
                  window.confirm("Bỏ thay đổi?") &&
                  changeTab(reviewTab) &&
                  getPostFromDatabase()
                }
                className="tab-teal active"
              >
                Xem
              </button>
              &ensp;
              <button
                ref={editTab}
                onClick={() => changeTab(editTab)}
                className="tab-teal"
              >
                Chỉnh sửa
              </button>
            </div>
            <hr />
            <div className="post">
              <Editor
                ref={contentEditor}
                disabled={tab !== editTab}
                apiKey="8gjew3xfjqt5cu2flsa3nz2oqr4z5bru9hr3phl05rsfyss3"
                init={{
                  plugins:
                    "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker",
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                }}
                initialValue={post?.content || "Đây là nội dung bài viết ..."}
                onChange={handleEditorChange}
              />
              {tab === editTab && (
                <div className="offset-md-10 col-md-2">
                  <button
                    onClick={() => processingEditPost()}
                    className="tab-teal active mt-2"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </div>
          </div>
        }
      ></AdminLayout>
    </>
  );
}
