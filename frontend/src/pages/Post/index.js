import { useNavigate } from "react-router";
import SmallPostCard from "../../components/SmallPostCard";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { apiURL } from "./../../App";
import PostCard from "../../components/PostCard";
import "./styles.css";
import TagBack from "../../components/TagBack";
import Footer from "../../components/Footer";
import { Badge } from "react-bootstrap";
import Pagination from "../../components/Pagination";
import { Autocomplete, TextField } from "@mui/material";

const VIEWED_POSTS_KEY = "VIEWED_POSTS_KEY_22_05_2024";

const colors = [
  "outline-danger",
  "outline-secondary",
  "outline-success",
  "outline-warning",
  "outline-info",
  "outline-primary",
];

export default function PostPage() {
  const [posts, setPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [newPosts, setNewPosts] = useState([]);

  const [tags, setTags] = useState([]);
  const [tagIds, setTagIds] = useState([]);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/tags")
      .then((res) => res.json())
      .then((tags) => {
        setTags(tags);
      })
      .catch((err) => {
        console.log(err);
        setTags([]);
      });
  }, []);

  function handleChoosingTag(id, target) {
    if (target?.className?.includes("active")) {
      target?.classList?.remove("active");
      setTagIds(
        tagIds.filter((tagId) => {
          return tagId !== id;
        })
      );
    } else {
      target?.classList.add("active");
      setTagIds([...tagIds, id]);
    }
  }

  function handleLink(currentPage) {
    setPage(currentPage);
  }

  const getPostsFromDatabase = () => {
    const api = apiURL + "posts/tags/pagination/" + page;
    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: tagIds, perpage: 3 }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
        setTotal(data.total);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const api = apiURL + "posts/new";
    fetch(api)
      .then((res) => res.json())
      .then((posts) => {
        setNewPosts(posts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getPostsFromDatabase();
  }, [tagIds, page]);

  useEffect(() => {
    const viewedPostIds =
      JSON.parse(localStorage.getItem(VIEWED_POSTS_KEY)) ?? [];

    const api = apiURL + "posts/ids";
    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: viewedPostIds }),
    })
      .then((res) => res.json())
      .then((posts) => {
        setRecentPosts(posts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const api = apiURL + "posts";
    fetch(api)
      .then((res) => res.json())
      .then((posts) => {
        setAllPosts(posts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSearch = (e, value) => {
    allPosts.forEach((post, index) => {
      if (value === post.title) {
        setPosts([allPosts[index]]);
        setTotal(1);
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

  return (
    <div className="post-content stack-page">
      <TagBack />

      <div className="bg-white">
        <h1 className="py-5 container">Khám phá các bài viết tại TFT</h1>
      </div>

      <div className="container">
        <div className="filter-posts">
          <Badge bg="secondary" text="white">
            <b>Lọc bài viết theo danh mục</b>
          </Badge>
          <br />

          {(tags &&
            tags.length > 0 &&
            tags.map((tag) => (
              <button
                onClick={(e) => handleChoosingTag(tag.id, e.target)}
                className={`btn btn-${
                  colors[(tag.id - 1) % colors.length]
                } m-1`}
                key={tag.id}
              >
                <LocalOfferIcon />
                {tag.name}
              </button>
            ))) || (
            <Badge bg="warning" text="dark">
              Đang tải các danh mục...
            </Badge>
          )}
        </div>
        <hr />

        <div className="posts">
          <Badge bg="secondary" text="white">
            <b>Danh sách các bài viết</b>
          </Badge>
          <div className="actions py-2">
            <div className="row">
              <div className="col">
                <Pagination
                  offset={2}
                  total={Math.ceil((total * 1.0) / 3)}
                  page={page}
                  handleLink={handleLink}
                />
              </div>

              <div className="col">
                <div className="search">
                  <Autocomplete
                    onBlur={handleCloseSearch}
                    onChange={handleSearch}
                    freeSolo
                    disableClearable
                    options={allPosts.map((post) => post.title)}
                    renderInput={(params) => (
                      <>
                        <TextField
                          onPointerEnter={handleSearch}
                          {...params}
                          label="Tìm kiếm bài viết"
                          InputProps={{
                            ...params.InputProps,
                            type: "search",
                          }}
                        />
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <br />
          <div className="row py-2">
            {(posts &&
              posts.length > 0 &&
              posts.map((post) => (
                <div key={post.id} className="post col-md-4 mt-2">
                  <PostCard post={post} />
                </div>
              ))) || (
              <Badge bg="warning" text="dark">
                Đang tải các bài viết...
              </Badge>
            )}
          </div>
        </div>
        <hr />

        <div className="recent-posts">
          <Badge bg="secondary" text="white">
            <b>Các bài viết đã xem gần đây</b>
          </Badge>

          <div className="row py-2">
            {(recentPosts &&
              recentPosts.length > 0 &&
              recentPosts.slice(0, 6).map((post, index) => (
                <div
                  key={post.id}
                  className={"col-md-2 " + (index % 2 != 0 ? " mt-md-3 " : "")}
                >
                  <SmallPostCard post={post} />
                </div>
              ))) || (
              <Badge bg="warning" text="dark">
                Đang tải các bài viết...
              </Badge>
            )}
          </div>
          <hr />
        </div>

        <div className="new-posts">
          <Badge bg="secondary" text="white">
            <b>Các bài viết mới đăng</b>
          </Badge>

          <div className="row py-2">
            {(newPosts &&
              newPosts.length > 0 &&
              newPosts.slice(0, 6).map((post, index) => (
                <div
                  key={post.id}
                  className={"col-md-2 " + (index % 2 != 0 ? " mt-md-3 " : "")}
                >
                  <SmallPostCard post={post} />
                </div>
              ))) || (
              <Badge bg="warning" text="dark">
                Đang tải các bài viết...
              </Badge>
            )}
          </div>
          <hr />
        </div>
      </div>
      <div className="bg-dark">
        <Footer />
      </div>
    </div>
  );
}
