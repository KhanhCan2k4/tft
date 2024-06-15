import { useState } from "react";
import "./styles.css";
import { imageURL } from "../../App";

export default function SlideListPost({ posts }) {
  const [activePost, setActivePost] = useState();

  const handleViewPost = (e) => {
    e.target.classList.add("hover");
    const index = e.target.dataset.index;
  };

  console.log(posts);

  const handleDisactivate = (e) => {
    document.querySelector(".post.hover")?.classList.remove("hover");
    setActivePost(undefined);
  };

  return (
    <>
      <div className="slide-list-post">
        <div className="row posts">
          {posts &&
            posts.map((post, index) => {
              const className = "post type-" + Math.floor(post.id % 4);
              return (
                <div key={post.id} className="col col-post">
                  <div
                    data-index={index}
                    onMouseEnter={handleViewPost}
                    className={className}
                  >
                    <img
                      className="img-fluid post-img"
                      src={imageURL + post.image}
                      alt="Hình ảnh bài viết"
                    />
                    <h6 className="post-title p-2">{post.title}</h6>
                    <span className="post-likes p-2">
                      <span className="px-2  badge rounded-pill text-bg-danger">
                        <i className="like">{post.likes}</i> &hearts;
                      </span>
                    </span>
                    <br className="py-5" />
                    <span className="post-views p-2">
                      <span className="px-2  badge rounded-pill text-bg-warning">
                        <i className="view">{post.views}</i>{" "}
                        <i class="bi bi-eye-fill"></i>
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        {activePost && (
          <div onMouseLeave={handleDisactivate} className="active-post">
            {activePost.content}
            {activePost.id}
          </div>
        )}
      </div>
    </>
  );
}
