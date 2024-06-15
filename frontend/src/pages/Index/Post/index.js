import { useEffect, useRef, useState } from "react";
import { apiURL, imageURL, slug } from "../../../App";
import "./styles.css";
import {
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "react-bootstrap";
import MultipleSelectTags from "../../../components/ChooseTag";
import { Parser } from "html-to-react";
import { Autocomplete, TextField } from "@mui/material";
import { Toast } from "primereact/toast";

export const TFT_LIKED_POSTS = "TFT_LIKED_POSTS";

export default function PostSubPage() {
  //refs
  const postsRef = useRef();
  const wrapperRef = useRef();
  const btnLike = useRef();
  const btnView = useRef();
  const toast = useRef();

  //states
  const [activePost, setActivePost] = useState();
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [tagIds, setTagIds] = useState([]);
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);

  //fetch data
  const getPostsFromDatabase = () => {
    const api = apiURL + "posts";
    fetch(api)
      .then((res) => res.json())
      .then((posts) => {
        setPosts(posts);
        setAllPosts(posts);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPostsByTagIds = (tagIds, isLoadMore = false) => {
    const api = apiURL + "posts/tags/pagination/" + page;

    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: tagIds }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isLoadMore) {
          setPosts([...posts, ...data.posts]);
        } else {
          setPosts(data.post);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //effects
  useEffect(() => {
    getPostsFromDatabase();
  }, []);

  //events
  const handleSlidePosts = (e) => {
    postsRef.current.style.transform = `translateX(-${
      (e.clientX / window.innerWidth) * 100
    }%)`;
  };

  const handleShow = (post) => {
    //update view
    const api = apiURL + "posts/view/" + post.id;
    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        btnView.current.textContent = data.view;
      });

    setActivePost(post);
    wrapperRef.current.classList.remove("show");
    wrapperRef.current.classList.add("hide");
    setShow(true);
  };

  const handleHide = () => {
    wrapperRef.current.classList.remove("hide");
    wrapperRef.current.classList.add("show");
    setShow(false);
  };

  const handleLike = (e) => {
    const api = apiURL + "posts/like/" + activePost.id;

    const likedPostIds =
      JSON.parse(localStorage.getItem(TFT_LIKED_POSTS)) ?? [];

    if (likedPostIds.includes(activePost.id)) {
      return;
    }

    likedPostIds.push(activePost.id);
    localStorage.setItem(TFT_LIKED_POSTS, JSON.stringify(likedPostIds));

    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        btnLike.current.textContent = data.like;
        e.target.className = "bi bi-heart-fill text-danger";
      });
  };

  const handleCopyLink = () => {
    const link =
      window.location.href +
      "bai-viet/lien-ket/" +
      activePost.id +
      "/" +
      slug(activePost.title);

    toast.current.show({
      severity: "success",
      summary: "Luư đường dẫn",
      detail: "Lưu thành công",
      life: 3000,
    });

    console.log(link);
  };

  const handleLoadMore = () => {
    setPage(page + 1);
    const isLoadMore = true;
    handleChooseTags(tagIds, isLoadMore);
  };

  const handleChooseTags = (tagIds) => {
    setTagIds(tagIds);
    if (tagIds.length > 0) {
      getPostsByTagIds(tagIds);
    } else {
      getPostsFromDatabase();
    }
  };

  const handleSearch = (e, value) => {
    posts.forEach((post, index) => {
      if (value === post.title) {
        setPosts([post[index]]);
        return;
      }
    });
  };

  const handleCloseSearch = (e) => {
    const value = e.target?.value;
    if (!value) {
      getPostsFromDatabase();
    }
  };

  const liked = () => {
    const likedPostIds =
      JSON.parse(localStorage.getItem(TFT_LIKED_POSTS)) ?? [];

    if (likedPostIds.includes(activePost && activePost.id)) {
      return " text-danger bi-heart-fill";
    }

    return " bi-heart";
  };

  return (
    <div className="mb-3 container pb-5" id="sub-post-page">
      <Toast ref={toast} />
      <div className="posts-title text-center">
        <p>
          Khám phá các bài viết mới tại <br />
          <h1>TFT</h1>
        </p>
      </div>

      <div
        ref={wrapperRef}
        onMouseMove={handleSlidePosts}
        className="posts-wrapper"
      >
        <div className="tags-frame">
          <div className="row">
            <div className="col-md-2">
              <MultipleSelectTags handleChooseTags={handleChooseTags} />
            </div>
          </div>
        </div>

        <div ref={postsRef} className="posts">
          {posts &&
            posts.map((post) => (
              <img
                src={
                  (post.image && imageURL + post.image) ||
                  "./src/posts/default.jpg"
                }
                alt={post.title}
                key={post.id}
                onClick={() => handleShow(post)}
                className="post"
              />
            ))}

          <div className="post py-5">
            <Button
              onClick={handleLoadMore}
              className="my-md-3 mx-auto d-block"
              variant="dark"
            >
              {"Tải thêm"}
            </Button>
          </div>
        </div>
      </div>

      {/* modal to view post's detail */}
      <Modal size="xl" show={show} onHide={handleHide}>
        <ModalHeader className="d-block">
          <div className="post-header">
            <div className="row">
              <div className="col-10">
                <h3 className="post-title">{activePost && activePost.title}</h3>
                <Badge pill bg="secondary">
                  <i>{activePost && activePost.created_at}</i>
                </Badge>
              </div>

              <div className="col-2 text-end">
                <Button variant="outline-dark" onClick={handleHide}>
                  <i className="bi bi-x"></i>
                </Button>
              </div>
            </div>
          </div>
        </ModalHeader>

        <ModalBody style={{ backgroundColor: "rgba(204,204,204, 0.3)" }}>
          <div className="post-content">
            {Parser().parse(activePost && activePost.content)}
          </div>
        </ModalBody>

        <ModalFooter className="d-block">
          <div className="post-react">
            <div className="row">
              <div className="col text-center" style={{ cursor: "pointer" }}>
                <i onClick={handleLike} className={"bi " + liked()}></i>
                <br />
                <Badge pill bg="danger">
                  <span ref={btnLike} className="post-likes">
                    {activePost && activePost.likes}
                  </span>
                </Badge>
              </div>

              <div className="col text-center" style={{ cursor: "pointer" }}>
                <i className="bi bi-eye-fill"></i>
                <br />
                <Badge pill bg="dark">
                  <span ref={btnView} className="post-views">
                    {activePost && activePost.views}
                  </span>
                </Badge>
              </div>
            </div>
          </div>

          <div className="text-end"></div>
        </ModalFooter>
      </Modal>
    </div>
  );
}
