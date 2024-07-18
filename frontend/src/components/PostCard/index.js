import { Card } from "antd";
import { imageURL, slug } from "../../App";
import "./styles.css";
import { Link, useNavigate } from "react-router-dom";
import { CardBody, CardImg } from "react-bootstrap";
import { Parser } from "html-to-react";
import { Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { TFT_LIKED_POSTS } from "../../App";

export default function PostCard({ post }) {
  const navigate = useNavigate();

  const [link, setLink] = useState(
    "./chi-tiet/" + post.id + "/" + slug(post.title)
  );

  const [likedPosts, setLikedPosts] = useState([]);

  //effects
  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem(TFT_LIKED_POSTS)) || [];
    setLikedPosts(likedPosts);
  }, []);

  return (
    <div className="p-1">
      <Card className="post-card">
        <CardBody className="post-card-body">
          <div className="row">
            <div className="col-md-4">
              <CardImg
                className="img-fluid"
                alt={"Ảnh bìa bài viết"}
                src={
                  (post.image && imageURL + post.image) ||
                  "./src/posts/default.jpg"
                }
              />
            </div>
            <div className="col-md-6">
              <Link
                className="text-decoration-dark text-dark fw-bold"
                to={link}
              >
                {post.title}
              </Link>
              <div
                style={{
                  height: "100px",
                  overflow: "hidden",
                  fontSize: "0.7em",
                }}
              >
                <i>{Parser().parse(post.content)}</i>
              </div>
              <Chip
                onClick={() => navigate(link)}
                label="Xem thêm"
                style={{ cursor: "pointer" }}
              />
              <div className="mt-1">
                {post.tags &&
                  post.tags.map((tag, index) => (
                    <Chip
                      className="mx-1"
                      color="primary"
                      size="small"
                      key={index}
                      label={<small>{tag.name}</small>}
                    />
                  ))}
              </div>
            </div>

            <div className="col-md-2 text-center">
              <h1>
                <p>{post.created_at && post.created_at.substring(8, 10)}</p>
              </h1>
              <i>
                {post.created_at && "Tháng " + post.created_at.substring(5, 7)}
              </i>
              <h3 className="my-2">
                <i
                  className={
                    "text-danger bi " +
                    (likedPosts.includes(post.id)
                      ? "bi-heart-fill"
                      : "bi-heart")
                  }
                ></i>
              </h3>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
