import { slug } from "../../App";
import "./styles.css";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div className="post-card">
      <div className="card text-start">
        <img
          className="card-img-top"
          src={
            (post.image && "./src/posts/" + post.image) || "./src/posts/default.jpg"
          }
          alt={(post && post.title) || "Hình ảnh bài viết"}
        />
        <div className="card-body">
          <h6 className="card-title">
            {(post && post.title + "...") || "Tiêu đề bài viết"}
          </h6>
          <hr />
          <div className="row">
            <span className="col-md-6">
              <b>Ngày đăng: </b>
              <i>{(post && post.created_at) || "12/12/2012"}</i>
            </span>
            <div className="col-md-6 text-end">
              <Link to={"/bai-viet/chi-tiet/" + slug(post && post.title)} state={post} className="btn-view btn btn-teal py-2 px-3">Xem bài viết</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
