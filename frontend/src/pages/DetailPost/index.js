import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Parser } from "html-to-react";
import "./styles.css";
import TagBack from "../../components/TagBack";
import { apiURL, getDate, imageURL, slug, TFT_LIKED_POSTS } from "../../App";
import { Chip } from "@mui/material";
import { Toast } from "primereact/toast";

export default function DetailPost() {
  //refs
  const navigate = useNavigate();
  const toast = useRef();

  //states
  const [post, setPost] = useState();
  const [likedPosts, setLikedPosts] = useState([]);

  //handlers
  const handleLike = (e) => {
    const likedPostIds =
      JSON.parse(localStorage.getItem(TFT_LIKED_POSTS)) ?? [];

    if (likedPostIds.includes(post.id)) {
      //unlike
      const api = apiURL + "posts/unlike/" + post.id;

      localStorage.setItem(
        TFT_LIKED_POSTS,
        JSON.stringify(likedPostIds.filter((id) => id !== post.id))
      );

      fetch(api).then(() => {
        e.target.className = "mx-2 bi bi-heart text-danger";
      });

      return;
    }

    //like
    const api = apiURL + "posts/like/" + post.id;

    likedPostIds.push(post.id);
    localStorage.setItem(TFT_LIKED_POSTS, JSON.stringify(likedPostIds));

    fetch(api).then(() => {
      e.target.className = "mx-2 bi bi-heart-fill text-danger";
    });
  };

  const handleCopyLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);

    toast.current.show({
      severity: "success",
      summary: "Luư đường dẫn",
      detail: "Lưu thành công",
      life: 3000,
    });
  };

  //get post by link
  useEffect(() => {
    const strArr = window.location.href.split("/");

    if (strArr.length >= 6) {
      const id = +strArr[5];

      //increasing post's view
      let api = apiURL + "posts/view/" + id;
      fetch(api);

      api = apiURL + "posts/" + id;

      fetch(api)
        .then((res) => res.json())
        .then((post) => {
          document.title = "TFT - " + post?.title;

          //redirect
          if (window.location.href.includes(slug(post.title))) {
            setPost(post);
          } else {
            navigate("/bai-viet/chi-tiet/" + post.id + "/" + slug(post.title));
          }
        })
        .catch((err) => {
          console.log("fetch post", err);
        });
    }
  }, []);

  //get liked posts
  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem(TFT_LIKED_POSTS)) ?? [];
    setLikedPosts(likedPosts);
  }, []);

  return (
    <div
      className="detail-post bg-white stack-page"
      style={{ minHeight: "100vh" }}
    >
      <TagBack link={"/bai-viet"} />
      <Toast ref={toast} />

      <img
        alt="Ảnh bài viết"
        className="img-fluid mx-auto d-block"
        src={
          (post && post.image && imageURL + post.image) ||
          "./../../../src/posts/default.jpg"
        }
      />

      <div className="container">
        <div className="title bg-white">
          <div className="pt-4">
            <div className="row">
              <div className="col-11">
                <h1 className="title">
                  <b>{post && post.title}</b>
                </h1>
                <Chip
                  label={post && post.created_at && getDate(post.created_at)}
                />

                <Chip
                  className="mx-1"
                  label={"Lượt xem: " + (post && post.views) || 0}
                />
              </div>

              <div className="col-1">
                <i
                  onClick={handleLike}
                  className={
                    "mx-2 text-danger bi " +
                    (likedPosts && likedPosts.includes(post && post.id)
                      ? "bi-heart-fill"
                      : "bi-heart")
                  }
                ></i>
                <i
                  onClick={handleCopyLink}
                  className="mx-2 text-primary bi bi-share"
                ></i>
              </div>
            </div>
          </div>
          <hr />
        </div>

        <div className="post">
          <div>{Parser().parse(post && post.content)}</div>

          <div className="post-react bg-white">
            {post &&
              post.tags &&
              post.tags.map((tag) => (
                <Chip
                  key={tag.id}
                  color="primary"
                  className="mx-1"
                  size="small"
                  label={tag.name}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
