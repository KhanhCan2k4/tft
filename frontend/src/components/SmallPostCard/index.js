import { Badge, Card } from "react-bootstrap";
import "./styles.css";
import { Link } from "react-router-dom";
import { slug } from "../../App";

const colors = ["danger", "secondary", "success", "warning", "info", "primary"];

export default function SmallPostCard({ post }) {
  return (
    <Card
      border={colors[post.id] ?? colors[0]}
      className="card small-post-card p-1"
    >
      <img
        src={
          (post.image && "./src/posts/" + post.image) ||
          "./src/posts/default.jpg"
        }
        alt="green iguana"
      />
      <Badge
        style={{ cursor: "pointer" }}
        bg={colors[post.id] ?? colors[0]}
      >
        <Link to={"/bai-viet/chi-tiet/" + slug(post && post.title)} state={post} style={{ textDecoration: "none", color: "white" }}>
          <i>{post.title}</i>
        </Link>
      </Badge>
    </Card>
  );
}
