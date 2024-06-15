import { useEffect, useState } from "react";
import TagBack from "../../components/TagBack";
import { useLocation } from "react-router";
import { Parser } from "html-to-react";
import { Badge, Form, InputGroup } from "react-bootstrap";
import "./styles.css";

export default function DetailPost() {
  const [post, setPost] = useState();

  const location = useLocation();

  useEffect(() => {
    setPost(location?.state);
  }, []);

  return (
    <div className="detail-post post-content stack-page">
      <TagBack link={"/bai-viet"} />
      <div className="title bg-white">
        <div className="container pt-4">
          <h1 className="title">
            <b>
              <i>{post && post.title}</i>
            </b>
          </h1>
        </div>
        <hr />
      </div>

      <div className="post">
        <div className="post-content container">
          {Parser().parse(post && post.content)}
        </div>

        <div className="post-react bg-white">
          <hr />
          <div className="row pb-4 px-5" style={{ width: "100%" }}>
            <div>
              <span className="mx-2 mb-2 py-2 px-4 btn btn-outline-danger rounded-pill">
                {post && post.likes} &hearts;
              </span>
              <span className="mx-2 mb-2 py-2 px-4 btn btn-warning rounded-pill">
                {post && post.likes} <i className="bi bi-eye-fill"></i>
              </span>
              <span className="mx-2 mb-2 py-2 px-4 btn btn-info rounded-pill">
                {post && post?.comments?.length || 0} <i className="bi bi-chat-fill"></i>
              </span>
            </div>
            <InputGroup>
              <Form.Control placeholder="Bình luận..." />
              <button className="ms-2 col-1 btn-send btn btn-danger">
                <i className="bi bi-send-fill"></i>
              </button>
            </InputGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
