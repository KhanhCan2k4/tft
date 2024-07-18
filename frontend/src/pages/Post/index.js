import { useEffect, useState } from "react";
import { apiURL, getDate, slug, TFT_LIKED_POSTS } from "./../../App";
import "./styles.css";
import TagBack from "../../components/TagBack";
import { Autocomplete, Chip, Pagination, TextField } from "@mui/material";
import PostCard from "../../components/PostCard";
import { Card, Checkbox } from "antd";
import { Link } from "react-router-dom";
import { Heart, HeartFill } from "react-bootstrap-icons";

export default function PostPage() {
  //states
  const [posts, setPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [newPosts, setNewPosts] = useState([]);

  const [tagIds, setTagIds] = useState([]);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [allPosts, setAllPosts] = useState([]);

  const [tags, setTags] = useState([]);

  //handlers
  const getPostsFromDatabase = () => {
    const api = apiURL + "posts/pagination/" + page;
    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
        setTotal(data.total);
      })
      .catch((err) => {
        console.log("fetch all posts", err);
      });
  };

  const getPostsByTagIds = (tagIds) => {
    const api = apiURL + "posts/tags/pagination/" + page;

    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: tagIds }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
        setPage(1);
        setTotal(data.total);
      })
      .catch((err) => {
        console.log("get posts by tags", err);
      });
  };

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

  const handleChooseTags = (check, id) => {
    if (check) {
      setTagIds([...tagIds, id]);
    } else {
      setTagIds(tagIds.filter((tag) => tag !== id));
    }
  };

  const handlePagination = (page) => {
    setPage(page);
  };

  useEffect(() => {
    document.title = "TFT - Khám phá các bài viết";
  }, []);

  //effects
  useEffect(() => {
    const api = apiURL + "tags";

    fetch(api)
      .then((res) => res.json())
      .then((tags) => {
        setTags(tags);
      })
      .catch((err) => {
        console.log("fetch tags", err);
      });
  }, []);

  //effects
  useEffect(() => {
    const api = apiURL + "posts/";
    fetch(api)
      .then((res) => res.json())
      .then((posts) => {
        setAllPosts(posts);
        setTotal(posts.length);
      })
      .catch((err) => {
        console.log("fetch all posts", err);
      });
  }, []);

  //get new posts
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

  //get posts with tags
  useEffect(() => {
    if (tagIds.length > 0) {
      getPostsByTagIds(tagIds);
    } else {
      getPostsFromDatabase();
    }
  }, [tagIds, page]);

  //get liked posts
  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem(TFT_LIKED_POSTS)) ?? [];

    const api = apiURL + "posts/ids";
    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: likedPosts }),
    })
      .then((res) => res.json())
      .then((posts) => {
        setRecentPosts(posts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="bg-white s stack-page pt-5" style={{ minHeight: "100vh" }}>
      <div
        className="text-center pt-4 pb-3 fixed-top bg-primary text-white s"
        style={{ borderBottom: "1px solid white" }}
      >
        <h3>CÁC BÀI VIẾT TẠI TFT</h3>
        <small>
          <i>
            Khám phá các hoạt động, các thành tích, ... mà cộng đồng TFT đã gặt
            hái trong suốt hành trình qua
          </i>
        </small>
      </div>

      <div className="row" style={{ marginTop: "70px" }}>
        <div className="fixed-top">
          <TagBack link={"/"} />
        </div>

        <div className="col-md-2 pt-2 bg-white">
          <div className="filter-posts">
            <div className="tags-frame">
              <div className="search ms-2 mb-3">
                <Autocomplete
                  onBlur={handleCloseSearch}
                  onChange={handleSearch}
                  freeSolo
                  disableClearable
                  options={allPosts.map((post) => post.title)}
                  renderInput={(params, index) => (
                    <TextField
                      key={index}
                      onPointerEnter={handleSearch}
                      {...params}
                      label={
                        <Chip key={index} label={<b>Tìm kiếm bài viết</b>} />
                      }
                      InputProps={{
                        ...params.InputProps,
                        type: "search",
                      }}
                    />
                  )}
                />
              </div>

              <Chip className="m-1" label={<b>Lọc bài viết theo danh mục</b>} />
              <div className="tags">
                {tags &&
                  tags.map((tag, index) => (
                    <Chip
                      className="m-1"
                      key={index}
                      label={
                        <Checkbox
                          onChange={(e) =>
                            handleChooseTags(e.target.checked, tag.id)
                          }
                        >
                          {tag.name}
                        </Checkbox>
                      }
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-7 pt-2 bg-white s">
          <Chip label={<b>Danh sách các bài viết</b>} />
          <Pagination
            defaultPage={page ?? 1}
            onChange={(e, page) => handlePagination(page)}
            count={Math.ceil(total / 5)}
            variant="outlined"
            color="error"
            className="my-2"
          />
          <div className="posts">
            <div className="row py-2">
              {(posts &&
                posts.length > 0 &&
                posts.map((post, index) => (
                  <div key={index} className="post mt-2">
                    <PostCard post={post} />
                  </div>
                ))) || <Chip label="Đang tải bài viết..." />}
            </div>
          </div>
        </div>

        <div className="col-md-3 pt-2">
          <Chip label={<b>Các bài viết mới đăng</b>} className="px-md-2 my-1" />
          <div className="new-posts">
            <div className="py-2">
              {(newPosts &&
                newPosts.length > 0 &&
                newPosts.slice(0, 6).map((post, index) => (
                  <Card key={index} className="m-1 p-2">
                    <span>
                      <Link
                        className="text-primary s fw-bold"
                        to={"./chi-tiet/" + post.id + "/" + slug(post.title)}
                      >
                        {post.title}
                      </Link>
                      <br />
                      {post.likes}{" "}
                      {(post.likes <= 0 && (
                        <Heart className="text-danger" />
                      )) || <HeartFill className="text-danger" />}
                      <br />
                      {getDate(post.created_at)}
                    </span>
                  </Card>
                ))) || <Chip label="Đang tải bài viết..." />}
            </div>
          </div>

          <hr />

          <Chip
            label={<b>Các bài viết yêu thích</b>}
            className="px-md-2 my-1"
          />
          <div className="recent-posts">
            <div className="row py-2">
              {(recentPosts &&
                recentPosts.length > 0 &&
                recentPosts.slice(0, 6).map((post, index) => (
                  <Card key={index} className="m-1 p-2">
                    <span>
                      <Link
                        className="text-primary s fw-bold"
                        to={"./chi-tiet/" + post.id + "/" + slug(post.title)}
                      >
                        {post.title}
                      </Link>
                      <br />
                      {post.likes}{" "}
                      {(post.likes <= 0 && (
                        <Heart className="text-danger" />
                      )) || <HeartFill className="text-danger" />}
                      <br />
                      {getDate(post.created_at)}
                    </span>
                  </Card>
                ))) || <Chip label="Đang tải bài viết..." />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
