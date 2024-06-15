import { useEffect, useRef, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "react-bootstrap";
import { apiURL, imageURL } from "../../App";
import { useNavigate } from "react-router";
import { Toast } from "primereact/toast";

export default function LinkForumPage() {
  const [forum, setForum] = useState();

  const navigate = useNavigate();
  const toast = useRef();
  const mssv = useRef();
  const note = useRef();

  useEffect(() => {
    const id = +window.location.href.split("/").slice(-1)[0] ?? 0;

    const api = apiURL + `forums/${id}`;
    fetch(api)
      .then((res) => res.json())
      .then((forum) => {
        setForum(forum);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = (e) => {
    e.target.textContent = "Đang tải...";

    const data = {
      mssv: mssv.current.value.toUpperCase(),
      note: note.current.textContent,
    };

    //validate mssv
    if (!/\d{5}TT\d{4}/g.test(data.mssv)) {
      toast.current.show({
        severity: "error",
        summary: "MSSV",
        detail: "Mã số sinh viên không hợp lệ!",
        life: 3000,
      });

      e.target.textContent = "Gửi yêu cầu";

      return;
    }

    const api = apiURL + `forums/to/${forum.id}`;
    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(() => {
        toast.current.show({
          severity: "success",
          summary: "Gửi yêu cầu",
          detail: "Gửi yêu cầu thành công",
          life: 3000,
        });
      })
      .catch((err) => {
        console.log(err);
        toast.current.show({
          severity: "error",
          summary: "Gửi yêu cầu",
          detail: "Gửi yêu cầu không thành công",
          life: 3000,
        });
      })
      .finally(() => {
        e.target.textContent = "Gửi yêu cầu";
      });
  };

  return (
    <Modal className="create-modal" show={true} size="xl">
      <ModalHeader>
        <i>{"Gửi yêu cầu tham gia cộng đồng "}</i> &ensp;
        <b>{" '" + ((forum && forum.name) || "Cộng đồng") + "'"}</b>
      </ModalHeader>
      <ModalBody>
        <div className="container d-flex justify-content-center align-items-top">
          <div className="row border rounded-5 p-3 bg-white shadow box-area">
            <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box image-2">
              <div className="featured-image mb-3">
                <img
                  src={
                    (forum && forum.cover && imageURL + forum.cover) ||
                    imageURL + "forums/default.jpg"
                  }
                  className="img-fluid img-2"
                  style={{ width: "250px;" }}
                  alt={(forum && forum.name) || "Cộng đồng"}
                />
              </div>
              <p
                className="text-white fs-2"
                style={{
                  fontFamily:
                    "'Courier New', Courier, monospace; font-weight: 600;",
                }}
              >
                {(forum && forum.name) || "Cộng đồng"}
              </p>
              <small
                className="text-white text-wrap text-center"
                style={{
                  width: "17rem;",
                  fontFamily: "'Courier New', Courier, monospace;",
                }}
              >
                {`Cùng ${(forum && forum.users?.length) || 0} thành viên`}
              </small>
            </div>

            <div className="col-md-6 right-box">
              <div className="row align-items-center">
                <div className="header-text mb-4">
                  <h2>TDC xin chào!</h2>
                  <p>Tham gia cộng đồng cùng chúng tôi</p>
                </div>

                <div className="input-group mb-3">
                  <input
                    ref={mssv}
                    type="text"
                    className="form-control form-control-lg bg-light fs-6"
                    placeholder="MSSV..."
                    required
                  />
                </div>

                <div className="input-group mb-1">
                  <textarea
                    ref={note}
                    className="form-control form-control-lg bg-light fs-6"
                    placeholder="Ghi chú cho admin..."
                  ></textarea>
                </div>
                <div className="input-group my-3">
                  <button
                    onClick={handleSubmit}
                    className="btn btn-lg btn-primary w-100 fs-6"
                  >
                    Gửi yêu cầu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>
      <Toast ref={toast} />
    </Modal>
  );
}
