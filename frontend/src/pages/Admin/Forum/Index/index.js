import { useEffect, useRef, useState } from "react";
import AdminLayout from "../../../../layouts/AdminLayout";
import AdminSubPage from "../../../../subpages/Admin";
import { apiURL, getDate } from "../../../../App";
import { Toast } from "primereact/toast";
import { CloseButton, Modal, ModalBody, ModalHeader } from "react-bootstrap";
import DisplayChart, { LineChart } from "../../../../components/DisplayChart";

export default function AdminForumIndex() {
  //refs
  const toast = useRef();

  //states
  const [threats, setThreats] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);
  const [showLine, setShowLine] = useState(false);

  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [dates, setDates] = useState([]);

  //handlers
  function getThreatsFromDatabase() {
    const api = apiURL + "threats/pagination/" + page;
    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        setThreats(
          data.threats &&
            data.threats.map((threat) => ({
              ...threat,
              created_at: getDate(threat.created_at),
              commentAmount: threat.comments && threat.comments.length,
            }))
        );

        setTotal(data.total);
      })
      .catch((err) => {
        console.log("fetch threats in forum: ", err);
      });
  }

  const handleRemoveThreat = (index) => {
    const api = apiURL + "threats/" + threats[index].id;

    fetch(api, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }).finally(() => {
      toast?.current?.show({
        severity: "success",
        summary: "Xoá câu hỏi",
        detail: "Xoá câu hỏi thành công",
        life: 3000,
      });
      getThreatsFromDatabase();
    });
  };

  //effects
  //set title
  useEffect(() => {
    document.title = "Administration Forum";
  }, []);

  useEffect(() => {
    getThreatsFromDatabase();
  }, [page]);

  useEffect(() => {
    const api = apiURL + "threats/analysis";

    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        setComments(data.comments);
        setLikes(data.likes);
        setDates(data.dates);
      });
  }, []);

  return (
    <>
      <Toast ref={toast} />
      <AdminLayout
        activeIndex={3}
        slot={
          <>
            <AdminSubPage
              title="ADMINISOLATION - THREATS IN FORUM"
              subTitle="WHAT THEY WANT TO KNOW?"
              columnTitles={["CONTENT", "CREATED AT"]}
              columns={["content", "created_at"]}
              list={threats}
              isAbleToAdd={false}
              total={total}
              page={page}
              handlePagination={setPage}
              handleRefresh={getThreatsFromDatabase}
              handleDelete={handleRemoveThreat}
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
                THREATS ANALYSIS
                <CloseButton onClick={() => setShow(false)} />
              </ModalHeader>

              <ModalBody>
                <DisplayChart
                  list={threats}
                  lable1={"Likes"}
                  lable2={"Comments"}
                  col1={"likes"}
                  col2={"commentAmount"}
                  colLabel={"content"}
                />
              </ModalBody>
            </Modal>

            <Modal show={showLine} onHide={() => setShowLine(false)} size="lg">
              <ModalHeader>
                THREATS ANALYSIS
                <CloseButton onClick={() => setShowLine(false)} />
              </ModalHeader>

              <ModalBody>
                <LineChart
                  firstName="Likes"
                  lastName="Comments"
                  firstData={likes}
                  lastData={comments}
                  columnLabels={dates}
                />
              </ModalBody>
            </Modal>
          </>
        }
      />
    </>
  );
}
