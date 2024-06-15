import { useNavigate } from "react-router"


export default function ActivePost({post, reverse}) {
    const navigate = useNavigate();

    return (
        <div className="active-post">
            <div className="row">
                <div className={" col-md-5 " + (reverse? " text-end " : "")}>
                    <img 
                        className={" img-fluid "} 
                        src={post.img && "./src/posts/" + post.img || "./src/posts/default.jpg"} 
                        alt={post.title || "Hình ảnh bài viết"}/>
                </div>
                <div className={"post-content col-md-7 " + (reverse? "order-first" : "")}>
                    <h3 onClick={() => navigate("/bai-viet")} className="post-title text-teal">{post.title}</h3>

                    <p>
                        {post.content.split(' ').slice(0, 200).join(" ")}
                    </p>

                    <button className="btn btn-teal btn-view-post fw-bold">
                        Xem bài viết
                    </button>
                </div>
            </div>
        </div>
    )
}