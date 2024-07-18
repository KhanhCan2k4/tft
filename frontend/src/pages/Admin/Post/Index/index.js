import {
  Badge,
  CloseButton,
  Modal,
  ModalBody,
  ModalHeader,
} from "react-bootstrap";
import AdminLayout from "../../../../layouts/AdminLayout";
import AdminSubPage from "../../../../subpages/Admin";
import { useEffect, useRef, useState } from "react";
import { apiURL } from "../../../../App";
import { Toast } from "primereact/toast";
import DisplayChart, { LineChart } from "../../../../components/DisplayChart";

export default function AdminPostIndex() {
  //refs
  const toast = useRef();

  //states
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);
  const [showLine, setShowLine] = useState(false);

  const [views, setViews] = useState([]);
  const [likes, setLikes] = useState([]);
  const [dates, setDates] = useState([]);

  //set title
  useEffect(() => {
    document.title = "Administration Posts";
  }, []);

  useEffect(() => {
    getPosts();
  }, [page]);

  useEffect(() => {
    const api = apiURL + "posts/analysis";

    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        setViews(data.views);
        setLikes(data.likes);
        setDates(data.dates);
      });
  }, []);

  //handlers
  function getPosts() {
    const api = apiURL + "posts/pagination/" + page;

    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
        setTotal(data.total);
      })
      .catch((err) => {
        console.log("Fetch posts", err);
      });
  }

  const handleDelete = (index) => {
    const api = apiURL + "posts/" + posts[index].id;

    fetch(api, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Remove post",
            detail: "Remove post successfully",
            life: 3000,
          });
        } else {
          toast.current.show({
            severity: "error",
            summary: "Remove post",
            detail: "Remove post failed",
            life: 3000,
          });
        }
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "Remove post",
          detail: "Remove post failed",
          life: 3000,
        });

        console.log("Remove post", err);
      })
      .finally(() => {
        getPosts();
      });
  };

  return (
    <AdminLayout
      activeIndex={2}
      slot={
        <>
          <Toast ref={toast} />
          <AdminSubPage
            title={"ADMINISTRATION - POSTS"}
            subTitle={"POSTS"}
            columnTitles={["TITLE", "CREATED AT", "UPDATED AT"]}
            columns={["title", "created_at", "updated_at"]}
            list={posts}
            total={total}
            page={page}
            handlePagination={setPage}
            handleDelete={handleDelete}
            handleRefresh={getPosts}
            headerComponent={() => (
              <div className="text-end">
                <button onClick={() => setShow(true)} className="btn m-1">
                  <i className="bi bi-bar-chart-fill text-danger"></i>
                </button>

                <button onClick={() => setShowLine(true)} className="btn m-1">
                  <i className="bi bi-graph-up text-danger"></i>
                </button>
              </div>
            )}
          />

          <Modal show={show} onHide={() => setShow(false)} size="lg">
            <ModalHeader>
              POSTS ANALYSIS
              <CloseButton onClick={() => setShow(false)} />
            </ModalHeader>

            <ModalBody>
              <DisplayChart
                list={posts}
                lable1={"Views"}
                lable2={"Likes"}
                col1={"views"}
                col2={"likes"}
                colLabel={"title"}
              />
            </ModalBody>
          </Modal>

          <Modal show={showLine} onHide={() => setShowLine(false)} size="lg">
            <ModalHeader>
              POSTS ANALYSIS
              <CloseButton onClick={() => setShowLine(false)} />
            </ModalHeader>

            <ModalBody>
              <LineChart
                firstName="Likes"
                lastName="Views"
                firstData={likes}
                lastData={views}
                columnLabels={dates}
              />
            </ModalBody>
          </Modal>
        </>
      }
    />
  );
}
