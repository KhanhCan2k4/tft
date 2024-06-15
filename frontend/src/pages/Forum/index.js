import "./styles.css";
import NavBar from "./../../components/Navbar/index";
import { useEffect, useRef, useState } from "react";
import { Parser } from "html-to-react";
import Modal from "react-bootstrap/Modal";
import { Avatar, AvatarGroup, Fab } from "@mui/material";
import { CloseButton, Form, InputGroup, ToastContainer } from "react-bootstrap";
import { apiURL, imageURL } from "../../App";
import { AddCircleOutline, Cookie } from "@mui/icons-material";
import { Editor } from "@tinymce/tinymce-react";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { type } from "@testing-library/user-event/dist/type";
import { Toast } from "primereact/toast";
import TagBack from "../../components/TagBack";

const user = {
  remember_token: "abcxyz",
  name: "Lê việt Khanh",
};

export const LIKED_POSTS_KEY = "LIKED_POSTS_KEY";

export default function ForumPage() {
  const modal = useRef();
  const addPostModal = useRef();
  const inputRef = useRef();
  const sendCommentRef = useRef();
  const toast = useRef();

  const nagivate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");

  const [show, setShow] = useState(false);
  const [isAdding, setAdding] = useState(false);

  const [isLogin, setLogin] = useState(false); // chỉ để hiện modal login

  const [activePost, setActivePost] = useState();
  const [posts, setPosts] = useState([]);
  const [addedPost, setAdded] = useState();
  const [addedComment, setAddedComment] = useState();
  const [forums, setForums] = useState([]);
  const [activeForum, setActiveForum] = useState();

  const [likedPostIds, setLikedPostIds] = useState([]);

  const contentEditor = useRef();

  const [cursorPosition, setCursorPosition] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = (post) => {
    setActivePost(post);
    return setShow(true);
  };

  //fetch posts
  useEffect(() => {
    const posts = [
      {
        id: 1,
        title: "Loading blog...",
        content: `
          <div className="bd-intro pt-2 ps-lg-2">
        <div className="d-md-flex flex-md-row-reverse align-items-center justify-content-between">
          <div className="mb-3 mb-md-0 d-flex text-nowrap"><a className="btn btn-sm btn-bd-light rounded-2" href="https://github.com/twbs/bootstrap/blob/v5.3.3/site/content/docs/5.3/components/alerts.md" title="View and edit this file on GitHub" target="_blank" rel="noopener">
              View on GitHub
            </a>
          </div>
          <h1 className="bd-title mb-0" id="content">Alerts</h1>
        </div>
        <p className="bd-lead">Provide contextual feedback messages for typical user actions with the handful of available and flexible alert messages.</p>
        <script async="" src="https://cdn.carbonads.com/carbon.js?serve=CKYIKKJL&amp;placement=getbootstrapcom" id="_carbonads_js"></script><div id="carbonads"><span>

<span className="carbon-wrap">
	<a href="https://srv.carbonads.net/ads/click/x/GTND427JCEAICK7YCE7LYKQUC6BDV27JCTADTZ3JCAYIP23JCY7DLK3KFTSDK5QWF6SIP27LCYSDE5QLCEY4YKQUC6BDLKJWFTYDTZDK2HUCN" className="carbon-img" target="_blank" rel="noopener sponsored">
		<img src="https://srv.carbonads.net/static/30242/214e19ab24dfe618f5372f2a8430b9872569ed23" alt="ads via Carbon" border="0" height="100" width="130" data-no-statview="no" style="max-width: 130px;">
	</a>
	<a href="https://srv.carbonads.net/ads/click/x/GTND427JCEAICK7YCE7LYKQUC6BDV27JCTADTZ3JCAYIP23JCY7DLK3KFTSDK5QWF6SIP27LCYSDE5QLCEY4YKQUC6BDLKJWFTYDTZDK2HUCN" className="carbon-text" target="_blank" rel="noopener sponsored">
		Get 10 Free Images From Adobe Stock. Start Now.
	</a>
</span>
<a href="http://carbonads.net/?utm_source=getbootstrapcom&amp;utm_medium=ad_via_link&amp;utm_campaign=in_unit&amp;utm_term=carbon" className="carbon-poweredby" target="_blank" rel="noopener sponsored">ads via Carbon</a>
</span></div>

      </div>
          `,
        likes: 12,
        views: 4,
        author: {
          name: "John Smith",
          avatar: "",
        },
        created_at: "2016-09-01T00:00:00",
      },
      {
        id: 2,
        title: "Loading blog...2",
        content:
          "Hello world from the blog website at http:// Blog.com and http http://blog.com",
        likes: 34,
        views: 8,
        author: {
          name: "Julia Philipp",
          avatar: "",
        },
        created_at: "2016-09-01T00:00:00",
      },
      {
        id: 3,
        title: "Loading blog..333.",
        content:
          "Hello world from the blog website at http:// Blog.com and http http://blog.com",
        likes: 0,
        views: 4,
        author: {
          name: "Onyx Software",
          avatar: "",
        },
        created_at: "2016-09-01T00:00:00",
      },
    ];

    setPosts(posts);
  }, []);

  //fetch forums
  useEffect(() => {
    getForumsFromDatabase();
  }, []);

  function getForumsFromDatabase() {
    const api = apiURL + "forums";
    fetch(api)
      .then((res) => res.json())
      .then((forums) => {
        setForums(forums);

        if (activeForum) {
          const forum = Array.from(forums).filter((forum) => {
            return forum.id === activeForum.id;
          })[0];

          if (activePost) {
            const post = Array.from(forum.posts).filter((post) => {
              return post.id === activePost.id;
            })[0];

            setActiveForum(forum);
            setActivePost(post);
          }
        } else {
          setActiveForum(forums[0]);
        }
      })
      .catch((err) => {
        console.log(err);
        setForums([]);
      });
  }

  function handleEditorChange(e) {
    // setPost(e.target.getContent());
    addedPost.content = e.target.getContent();
    setAdded(addedPost);

    // Update cursor position
    const editor = contentEditor.current.editor;
    const selection = editor.selection.getRng();
    setCursorPosition(selection.startOffset);
  }

  // Function to restore cursor position
  function restoreCursorPosition() {
    const editor = contentEditor.current?.editor;
    editor?.selection?.select(editor.getBody(), true);
    editor?.selection?.collapse(false);
    editor?.selection?.setRng(cursorPosition, cursorPosition);
  }

  function handlePost() {
    //add into
    const api = apiURL + `posts`;
    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...addedPost, forum: activeForum.id, author: 0 }),
    })
      .then((res) => res.json())
      .then((data) => {
        switch (data.status) {
          case 200:
            getForumsFromDatabase();
            toast.current.show({
              severity: "success",
              summary: "Đăng bài",
              detail: "Đăng bài thành công",
              life: 3000,
            });
            break;
          case 422:
            toast.current.show({
              severity: "error",
              summary: "Đăng bài",
              detail: "Đăng bài không thành công",
              life: 3000,
            });
            break;
          default:
            toast.current.show({
              severity: "error",
              summary: "Đăng bài",
              detail: "Đăng bài không thành công",
              life: 3000,
            });
            break;
        }
      })
      .then(() => {
        toast.current.show({
          severity: "info",
          summary: "Mẹo",
          detail: "Chọn lại tab cộng đồng để tải lại",
          life: 3000,
        });
      })
      .catch((err) => {
        console.log(err);
        toast.current.show({
          severity: "error",
          summary: "Đăng bài",
          detail: "Đăng bài không thành công",
          life: 3000,
        });
      });

    //remove modal's data
    setAdded(undefined);
    setAdding(false);
  }

  function handleAddComment() {
    console.log(addedComment);
    inputRef.current.value = "";
    sendCommentRef.current.innerHTML = "...";

    //save comment into database
    const url = apiURL + `posts/${activePost.id}`;
    fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...activePost,
        comment: { content: addedComment },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        switch (data.status) {
          case 200:
            toast.current.show({
              severity: "success",
              summary: "Bình luận",
              detail: "Thêm bình luận thành công",
              life: 1500,
            });
            getForumsFromDatabase();
            break;
          case 422:
            toast.current.show({
              severity: "error",
              summary: "Bình luận",
              detail: "Thêm bình luận không thành công",
              life: 1500,
            });
            break;
          default:
            toast.current.show({
              severity: "error",
              summary: "Bình luận",
              detail: "Thêm bình luận không thành công",
              life: 1500,
            });
            break;
        }
      })
      .catch((err) => {
        console.log(err);
        toast.current.show({
          severity: "error",
          summary: "Bình luận",
          detail: "Thêm bình luận không thành công",
          life: 1500,
        });
      })
      .finally(() => {
        sendCommentRef.current.innerHTML = "";
        const icon = document.createElement("i");
        icon.className = "bi bi-send-fill";

        sendCommentRef.current.append(icon);
      });

    //remove all data
    setAddedComment("");
  }

  function handleDelete() {}

  // Call restoreCursorPosition after re-render
  useEffect(() => {
    restoreCursorPosition();
  });

  useEffect(() => {
    if (localStorage.getItem("infor_user")) {
      nagivate("/quan-tri");
    }
  }, []);

  const handleLogin = () => {
    const api = apiURL + "login";

    const data = { email: email, password: password, role: "student" };

    fetch(api, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        switch (data.status) {
          case 200:
            const user = {
              ...data.infor_user,
              remember_token: data.remember_token,
            };
            window.localStorage.setItem("user", JSON.stringify(user));
            setLogin(false);
            setUser(user);
            alert(data.message);
            // toast.success(data.message);
            break;
          case 422:
            alert(data.message);
            // toast.success(data.message);
            break;
          default:
            break;
        }
      });
  };

  const handleLogout = () => {
    setUser(undefined); // xoa cua minh
    window.localStorage.removeItem("user"); // xoa tren localStorage
    alert("Đăng xuất????");
  };

  useEffect(() => {
    let lists = JSON.parse(window.localStorage.getItem(LIKED_POSTS_KEY)) ?? [];

    setLikedPostIds(lists);
  }, []);

  const setLike = (e) => {
    const id = +e.target.value;
    if (!likedPostIds?.includes(id)) {
      e.target.classList.remove("active");
      e.target.classList.add("active");

      likedPostIds.push(id);
      window.localStorage.setItem(
        LIKED_POSTS_KEY,
        JSON.stringify(likedPostIds)
      );

      const api = apiURL + "posts/like/" + id;
      fetch(api, {
        method: "POST",
        headers: { append: { "Content-Type": "application/json" } },
      });
    }
  };

  const setView = (e, id) => {
    console.log(e);
    const api = apiURL + "posts/view/" + id;
    fetch(api, {
      method: "POST",
      headers: { append: { "Content-Type": "application/json" } },
    })
      .then((res) => res.json())
      .then((view) => {
        try {
          e.textContent = view;
        } catch (error) {
          //ignore
        }
      });
  };

  return (
    <div className="forum-page stack-page">
      <TagBack />

      <Toast ref={toast} />

      <div className="row content">
        <div className="forum-nav-side">
          {forums &&
            forums.map((forum) => (
              <div
                onClick={() => {
                  console.log(forum.name);
                  setActiveForum(forum);
                }}
                key={forum.id}
                className={
                  "forum-tag text-start " +
                  (activeForum && activeForum.id === forum.id ? "active" : "")
                }
              >
                <div className="row">
                  <div className="col-md-3">
                    <img
                      className="img-fluid"
                      src={imageURL + forum.cover}
                      alt={forum.name}
                    />
                  </div>
                  <div className="col-md-9">
                    <h5>{forum.name}</h5>
                    <AvatarGroup total={forum.users.length}>
                      {forum.users &&
                        forum.users.map((user) => (
                          <Avatar
                            alt={user.name}
                            src={imageURL + user.avatar}
                          />
                        ))}
                    </AvatarGroup>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="col-md-8">
          <div className="main-content">
            {activeForum &&
              activeForum.posts &&
              Array.from(activeForum.posts)
                .reverse()
                .map((post) => (
                  <div data-id={post.id} key={post.id} className="post">
                    <div className="post-owner d-flex">
                      <Avatar
                        src={imageURL + post.author.avatar}
                        alt={post.author.name}
                      />
                      <div className="ps-2">
                        <b>{post.author.name}</b>
                        <br />
                        <span>
                          <b>
                            <i>Ngày đăng: </i>
                          </b>
                          {post.created_at}
                        </span>
                      </div>
                      <CloseButton onClick={handleDelete} className="ms-auto" />
                    </div>
                    <hr />

                    <div className="post-content">
                      <h3 className="post-title">{post.title}</h3>
                      <hr />

                      <div className="post-content">
                        {Parser().parse(post.content)}
                      </div>
                      <hr />

                      <div className="post-react">
                        <div className="row">
                          <div className="col-3">
                            <button
                              value={post.id}
                              onClick={setLike}
                              className={
                                "btn-like btn btn-outline-danger " +
                                (likedPostIds?.includes(post.id)
                                  ? "active"
                                  : "")
                              }
                            >
                              &hearts;
                            </button>
                            <br />
                          </div>
                          <div className="col-5">
                            <button
                              value={post.id}
                              className="btn-comment btn btn-light text-start"
                              onClick={(e) => {
                                setView(
                                  e.target?.parentElement?.nextElementSibling?.querySelector(
                                    ".post-views"
                                  ),
                                  +e.target.value
                                );
                                handleShow(post);
                              }}
                              style={{ width: "100%" }}
                            >
                              <i className="bi bi-chat-heart-fill pe-2"></i>
                              Bình luận...
                            </button>
                          </div>
                          <div className="col-4 text-end">
                            <span className="px-3 py-2 badge rounded-pill text-bg-info">
                              <i className="post-comment">
                                {post.comments?.length || 0}
                              </i>{" "}
                              <i class="bi bi-chat"></i>
                            </span>
                            &ensp;
                            <span className="px-3 py-2 badge rounded-pill text-bg-danger">
                              <i className="post-likes">{post.likes}</i>{" "}
                              &hearts;
                            </span>
                            &ensp;
                            <span className="px-3 py-2 badge rounded-pill text-bg-warning">
                              <i className="post-views">{post.views}</i>{" "}
                              <i className="bi bi-eye-fill"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {activeForum && (
          <div className="btn-add fixed-bottom text-end me-3 mb-3">
            <Fab
              onClick={() => setAdding(true)}
              color="primary"
              aria-label="add"
            >
              <AddCircleOutline />
            </Fab>
          </div>
        )}

        {!user && (
          <div className="btn-login fixed-bottom text-end me-3">
            <Fab
              onClick={() => setLogin(true)}
              color="primary"
              aria-label="add"
            >
              <LoginOutlinedIcon />
            </Fab>
          </div>
        )}

        {/* LOG OUT */}
        {user && (
          <div className="btn-login fixed-bottom text-end me-3">
            <Fab onClick={handleLogout} color="primary" aria-label="add">
              <LogoutIcon />
            </Fab>
          </div>
        )}

        <div ref={modal}>
          <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
              <div className="post-owner d-flex">
                <Avatar
                  src={imageURL + (activePost && activePost.author.avatar)}
                  alt={activePost && activePost.author.name}
                />
                <div className="ps-2">
                  <b>{activePost && activePost.author.name}</b>
                  <br />
                  <span>
                    <b>
                      <i>Ngày đăng: </i>
                    </b>
                    {activePost && activePost.created_at}
                  </span>
                </div>
              </div>
            </Modal.Header>
            <Modal.Body>
              <Modal.Title>{activePost && activePost.title}</Modal.Title>
              <hr />
              <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
                {activePost &&
                  activePost.comments &&
                  Array.from(activePost.comments)
                    .reverse()
                    .map((comment) => (
                      <div className="d-flex mb-3">
                        <Avatar alt="Dowpad" src="Dowpad" />
                        <div className="ps-2 py-2">
                          {comment && comment.content}
                        </div>
                      </div>
                    ))}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <div className="row" style={{ width: "100%" }}>
                <Avatar
                  className="col-2 me-2"
                  alt="Hello World"
                  src="./src/images/users/user-1.png"
                />
                <div className="col-9 btn-comment">
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-chat-heart-fill pe-2"></i>
                    </InputGroup.Text>
                    <Form.Control
                      ref={inputRef}
                      onChange={(e) => {
                        setAddedComment(e.target.value);
                      }}
                      placeholder="Bình luận..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.keyCode === 13) {
                          handleAddComment();
                        }
                      }}
                    />
                  </InputGroup>
                </div>

                <button
                  ref={sendCommentRef}
                  onClick={handleAddComment}
                  className="ms-2 col-1 btn-send btn btn-danger"
                >
                  <i className="bi bi-send-fill"></i>
                </button>
              </div>
            </Modal.Footer>
          </Modal>
        </div>

        <div ref={addPostModal}>
          <Modal show={isAdding} onHide={() => setAdding(false)} size="lg">
            <Modal.Header closeButton>
              <div className="post-owner d-flex">
                <Avatar src={imageURL + "user avatar"} alt={"User name"} />
                <div className="ps-2">
                  <b>{"User name"}</b>
                  <br />
                  <span>
                    <b>
                      <i>Ngày đăng: </i>
                    </b>
                    {new Date().getDate() +
                      "/" +
                      (new Date().getMonth() + 1) +
                      "/" +
                      new Date().getFullYear() +
                      " " +
                      new Date().getHours() +
                      ":" +
                      new Date().getMinutes() +
                      ":" +
                      new Date().getSeconds()}
                  </span>
                </div>
              </div>
            </Modal.Header>

            <Modal.Body>
              <Form.Control
                onChange={(e) =>
                  setAdded({ ...addedPost, title: e.target.value })
                }
                type="text"
                className="mb-2 fw-bold"
                max={255}
                placeholder="Tiêu đề bài viết..."
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
                onChange={handleEditorChange}
              />
            </Modal.Body>
            <Modal.Footer>
              <button onClick={handlePost} className="btn btn-outline-success">
                Đăng
              </button>
            </Modal.Footer>
          </Modal>
        </div>

        <div ref={addPostModal}>
          <Modal
            style={{ background: "transparent" }}
            show={isLogin}
            onHide={() => setLogin(false)}
            size="lg"
          >
            <div class="container d-flex justify-content-center align-items-center min-vh-80">
              <div
                class="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box"
                style={{ background: "#103cbe", height: "400px" }}
              >
                <div class="featured-image mb-3">
                  <img
                    src="./src/images/image2.jpg"
                    alt="image"
                    class="img-fluid img-2"
                  />
                </div>
                <p
                  class="text-white fs-2"
                  style={{
                    fontFamily: "'Courier New', Courier, monospace;",
                    fontWeight: "600;",
                  }}
                >
                  Be Verified
                </p>
                <small
                  class="text-white text-wrap text-center"
                  style={{ fontFamily: "'Courier New', Courier, monospace;" }}
                >
                  Join experienced Designers on this platform.
                </small>
              </div>
              <div class="col-md-6 right-box">
                <div class="row align-items-center">
                  <div class="header-text mb-4">
                    <h2>Hello,User</h2>
                    <p>We are happy to have you back.</p>
                  </div>
                  <div class="input-group mb-3">
                    <input
                      onChange={(event) => setEmail(event.target.value)}
                      type="text"
                      class="form-control form-control-lg bg-light fs-6"
                      placeholder="Email address"
                    />
                  </div>
                  <div class="input-group mb-1">
                    <input
                      onChange={(event) => setPassword(event.target.value)}
                      type="password"
                      class="form-control form-control-lg bg-light fs-6"
                      placeholder="Password"
                    />
                  </div>
                  <div class="input-group mb-5 d-flex justify-content-between">
                    <div class="form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        id="formCheck"
                      />
                      <label
                        for="formCheck"
                        class="form-check-label text-secondary"
                      >
                        <small>Remember Me</small>
                      </label>
                    </div>
                    <div class="forgot">
                      <small>
                        <a href="#">Forgot Password?</a>
                      </small>
                    </div>
                  </div>
                  <div class="input-group mb-3">
                    <button
                      onClick={handleLogin}
                      class="btn btn-lg btn-primary w-100 fs-6"
                    >
                      Login
                    </button>
                  </div>
                  <div class="input-group mb-3">
                    <button class="btn btn-lg btn-light w-100 fs-6">
                      <img
                        src="./src/images/gg1.png"
                        style={{ width: "20px" }}
                        class="me-2"
                      />
                      <small>Sign In with Google</small>
                    </button>
                  </div>
                  <div class="row">
                    <small className="sign-up">
                      Don't have account?
                      <a href="#">Sign Up</a>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}
