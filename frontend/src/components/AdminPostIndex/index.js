import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Link, json } from "react-router-dom";
import Pagination from "../Pagination";
import DisplayChart from "../DisplayChart";
import "./styles.css";
import { apiURL } from "../../App";
import { Chart as ChartJS, CategoryScale, BarElement, LinearScale, Title } from 'chart.js';
import { Parser } from "html-to-react";

// Đăng ký các thành phần cần thiết cho biểu đồ
ChartJS.register(CategoryScale, BarElement, LinearScale, Title);

const initPost = {
  id: 0,
  title: "Tiêu đề bài viết",
  content: "Nội dung bài viết",
  author: 1,
};

const initTag = {
  id: 0,
  name: "fake"
};

function AdminPostIndex() {
  const chartRef = useRef(); // Tạo một ref cho canvas
  const modal = useRef();

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [posts, setPosts] = useState([initPost]);
  const [tags, setTags] = useState([initTag]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [show, setShow] = useState(false);
  const [reviewedPost, setReviewedPost] = useState(initPost);
  const [tagIds, setTagIds] = useState([]);
  const [chartModalShow, setChartModalShow] = useState(false);
  const [showTags, setShowTags] = useState(false); // State để quản lý việc hiển thị

  useEffect(() => {
    getDataFromDatabase();
  }, [page, tagIds]);

  useEffect(() => {
    getTagsFromDatabase();
  }, []);

  function getDataFromDatabase() {
    const api = apiURL + `posts/tags/pagination/${page}`;
    fetch(api, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ids: tagIds}),
    })
    .then(res => res.json())
    .then(({posts, total}) => {
      setPosts(Array.from(posts));
      setTotal(total);
    })
    .catch(err => {
      setPosts([]);
      console.log(err);
    });
  }

  function handleChoosingTag(id, target) {
    if (!target.checked) {
      setTagIds(tagIds.filter(tagId => tagId !== id));
    } else {
      setTagIds([...tagIds, id]);
    }
  };
  
  
  function getTagsFromDatabase() {
    const api = apiURL + `tags`;
    fetch(api)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Tags data:", data);
        if (Array.isArray(data)) {
          setTags(data);
        } else {
          console.error("Invalid data structure:", data);
          setTags([initTag]);
        }
      })
      .catch((err) => {
        console.log("Fetch error:", err);   
        setTags([initTag]);
      });
  }

  // function getFilteredPosts() {
  //   const api = apiURL + `posts/filter?tags=${selectedTags.join(',')}&page=${page}`;
  //   fetch(api)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setTotal(data.total);
  //       setPosts(Object.values(data.posts));
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setPosts([initPost]);
  //     });
  // }

  const handleTagChange = (e) => {
    const value = parseInt(e.target.value);
    setSelectedTags(prevState =>
      prevState.includes(value)
        ? prevState.filter(tag => tag !== value)
        : [...prevState, value]
    );
  };

  const handleClose = () => setShow(false);
  
  const handleShow = (post) => {
    setReviewedPost(post);
    return setShow(true);
  };

  function handleDeletePost(id) {
    fetch(`http://localhost:8000/api/posts/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(() => {
        getDataFromDatabase();
      })
      .catch((err) => {
        console.error('Error:', err);
      });
  }

  function handleLink(currentPage) {
    setPage(currentPage);
  }

  const handleShowChart = () => {
    setChartModalShow(true);
  };

  const handleToggleTags = () => {
    setShowTags(!showTags);
    document.querySelector('.filterIcon').classList.toggle('active');
    document.querySelector('.tags-filter').classList.toggle('active');
  };

  console.log(posts);

  return (
    <div className="admin-posts">
      <h1>Quản lý bài viết</h1>

      <div className="row">
        <div className="col">
          <Link
            to={"them-bai-viet"}
            className="btn btn-outline-success my-3"
            href="http://127.0.0.1:8000/admin/products/create"
          >
            Thêm bài viết mới
          </Link>
        </div>
        <div className="col text-end">
          <span
            className="btn btn-outline-teal filterIcon my-3 me-3 ms-auto"
            onClick={handleToggleTags}
          >
            <i className="bi bi-funnel"></i>
          </span>
          <a
            className="btn btn-outline-teal my-3 ms-auto d-inline-block"
            onClick={handleShowChart}
          >
            Xem biểu đồ
          </a>
          <br></br>
          {/* Hiển thị các checkbox cho tags */}
          <div className={`tags-filter ${showTags ? 'active' : ''} py-2 z-10 row`}>

            {tags.map((tag) => (
              <div key={tag.id} className="col-5 form-check form-check-inline">
                          <div className="">
                  <input
                    className="form-check-input"
                    key={tag.id}
                    type="checkbox"
                    value={tag.id}
                    id={`tag-${tag.id}`}
                    onChange={handleTagChange}
                    onClick={(e) => handleChoosingTag(tag.id, e.target)}
                  />
                  <label className="form-check-label" htmlFor={`tag-${tag.id}`}>
                    {tag["name"]}
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Modal để hiển thị biểu đồ */}
          <Modal size="lg" show={chartModalShow} onHide={() => setChartModalShow(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Biểu đồ bài viết</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <DisplayChart posts={posts} />
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-teal" onClick={() => setChartModalShow(false)}>
                Đóng
              </button>
            </Modal.Footer>
          </Modal>
        </div>
        <div className="alert alert-success mt-3"></div>
        <div className="alert alert-danger"></div>

        <Pagination page={page} total={Math.ceil(total * 1.0 / 5)} handleLink={handleLink} />

        <table className="table table-striped">
          <thead>
            <tr>
              <td>ID</td>
              <td>Tiêu đề</td>
              <td>Lượt xem</td>
              <td>Lượt thích</td>
              <td>Ngày đăng</td>
              <td>Lần cập nhật gần nhất</td>
              <td>Tác giả</td>
              <td className="text-center" colSpan="3">
                Action
              </td>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {posts && posts.map((post, index) => (
              <tr key={index}>
                <td>{post["id"]}</td>
                <td>{post["title"]}</td>
                <td>{post["views"]}</td>
                <td>{post["likes"]}</td>
                <td>{post["created_at"]}</td>
                <td>{post["updated_at"]}</td>
                <td>
                  <img
                    src={post["avatar"]}
                    className="img-fluid rounded-top"
                    alt=""
                  />
                </td>
                <td>
                  <span
                    onClick={() => handleShow(post)}
                    className="btn btn-outline-success"
                  >
                    <i className="bi bi-eye-fill"></i>
                  </span>
                </td>
                <td>
                  <Link
                    to={"./chinh-sua-bai-viet"}
                    state={post}
                    className="btn btn-outline-warning"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Link>
                </td>
                <td>
                  <span
                    onClick={() =>
                      window.confirm("Xác nhận xoá bài viết?") &&
                      handleDeletePost(post.id)
                    }
                    className="btn btn-outline-danger"
                  >
                    <i className="bi bi-x-circle"></i>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div ref={modal}>
        <Modal show={show} onHide={handleClose} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>{reviewedPost.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{Parser().parse(reviewedPost.content)}</Modal.Body>
          <Modal.Footer>
            <button className="btn btn-teal" onClick={handleClose}>
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>

  );
}

export default AdminPostIndex;
