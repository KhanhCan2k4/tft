import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import emailjs from "emailjs-com";
import { apiURL } from "../../App";
import { Modal } from "react-bootstrap";
import { Parser } from "html-to-react";
import { Alert } from "@mui/material";

const initContact = {
  id: 0,
  name: "Unknown User",
  email: "",
  subject: "",
  message: "",
};

function AdminContactIndex() {
  const [contacts, setContacts] = useState([initContact]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [activeIndex, setActiveIndex] = useState(0);
  const [show, setShow] = useState(false);
  const modal = useRef();
  const message = useRef();
  const alert = useRef();

  useEffect(() => {
    getContactsFromDatabase();
  }, []);

  function getContactsFromDatabase() {
    fetch("http://localhost:8000/api/contacts")
      .then((res) => res.json())
      .then((contacts) => {
        setContacts(contacts);
      })
      .catch((err) => {
        console.log(err);
        setContacts([initContact]);
      });
  }

  const handleDeleteContact = (e) => {
    e.target.textContent = "Đang tải...";
    const id = +e.target?.value ?? -1000;

    const contact = contacts.find((contact) => contact.id === id);

    if (!contact) {
      return;
    }

    //send refuse contact
    emailjs
      .send(
        "service_miw9zp4",
        "template_bjyfjbd",
        {
          from_name: "TDC - Cao đẳng Công nghệ Thủ Đức",
          to_name: contact.name,
          message:
            "Xin lỗi, TDC hiện không thể phản hồi về thông tin mà bạn muốn. Rất mong sẽ có sự đồng hành với bạn sau!",
          reply_to: contact.email,
        },
        "nbxhmGhQt4JpgZSUa"
      )
      .then(() => {
        console.log("Sent contact successfully");
      })
      .catch((err) => {
        console.log("Send contact failed: ", err);
      });

    //delete contact
    const api = apiURL + "contacts/" + id;
    fetch(api, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }).then(() => {
      getContactsFromDatabase();
    });
  };

  const handleClose = () => setShow(false);

  const handleReply = (e) => {
    if (message.current.value === "") {
      alert.current.style.display = "flex";
      return;
    }

    e.target.textContent = "Đang tải...";
    //send reply contact
    emailjs
      .send(
        "service_miw9zp4",
        "template_bjyfjbd",
        {
          from_name: "TDC - Cao đẳng Công nghệ Thủ Đức",
          to_name: contacts[activeIndex]?.name ?? "Unknown",
          message: message.current.value,
          reply_to: contacts[activeIndex]?.email,
        },
        "nbxhmGhQt4JpgZSUa"
      )
      .then(() => {
        console.log("Sent contact successfully");
      })
      .catch((err) => {
        console.log("Send contact failed: ", err);
      })
      .finally(() => {
        e.target.textContent = "Gửi phản hồi";
        handleClose();
        //delete contact
        const api = apiURL + "contacts/" + contacts[activeIndex]?.id;
        fetch(api, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }).then(() => {
          getContactsFromDatabase();
        });
      });
  };

  const handleShow = (e) => {
    const id = +e.target?.value ?? 0;

    console.log(id);

    setActiveIndex(id);
    setShow(true);
  };

  return (
    <>
      <h1>Quản lý Liên Hệ</h1>

      <div className="row">
        <div
          className="alert alert-success"
          style={{ display: successMessage ? "block" : "none" }}
        >
          {successMessage}
        </div>
        <div
          className="alert alert-danger"
          style={{ display: errorMessage ? "block" : "none" }}
        >
          {errorMessage}
        </div>

        <table className="table table-striped text-center">
          <thead>
            <tr>
              <td>ID</td>
              <td>Họ & Tên</td>
              <td>Email</td>
              <td>Số điện thoại</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr key={contact.id}>
                <td>{contact.id}</td>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td className="text-end">
                  <button
                    value={index}
                    onClick={handleShow}
                    className="btn btn-outline-warning ms-auto mx-2"
                  >
                    Phản hồi
                  </button>

                  <button
                    value={contact.id}
                    className="btn btn-outline-danger ms-auto mx-2 me-md-5"
                    onClick={handleDeleteContact}
                  >
                    Từ chối
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div ref={modal}>
          <Modal show={show} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
              <p>
                <b>{contacts[activeIndex]?.name}</b>
              </p>{" "}
              &ensp;
              <p>
                <i>{contacts[activeIndex]?.email}</i>
              </p>
            </Modal.Header>
            <Modal.Body>
              <p>
                <b>Nội dung liên hệ:</b>
              </p>
              <textarea className="form-control" rows={3} readOnly>
                {Parser().parse(contacts[activeIndex]?.content)}
              </textarea>

              <br />
              <p>
                <b>Nội dung phản hồi:</b>
              </p>
              <textarea
                ref={message}
                rows={3}
                className="form-control"
              ></textarea>
              <Alert
                style={{ display: "none" }}
                ref={alert}
                variant="outlined"
                severity="error"
                className="mt-2"
              >
                Không thể để trống nội dung phản hồi
              </Alert>
            </Modal.Body>
            <Modal.Footer>
              <button
                value={contacts[activeIndex]?.id}
                className="btn btn-teal"
                onClick={handleReply}
              >
                Gửi phản hồi
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default AdminContactIndex;
