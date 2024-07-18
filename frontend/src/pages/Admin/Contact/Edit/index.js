import { useContext, useEffect, useRef, useState } from "react";
import {
  CloseButton,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
import emailjs from "emailjs-com";
import { Toast } from "primereact/toast";
import { apiURL, ConfigContext, getDate } from "../../../../App";
import { Chip } from "@mui/material";

export default function AdminContactEdit() {
  const toast = useRef();

  const [contact, setContact] = useState();
  const [reply, setReply] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const configs = useContext(ConfigContext);

  useEffect(() => {
    setContact(location.state);
  }, []);

  useEffect(() => {
    console.log(contact);
  }, [contact]);

  const handleReply = (e) => {
    e.target.textContent = "Loading..";
    emailjs
      .send(
        configs?.find((config) => config.key === "EMAIL_SERVICE_ID")?.value ||
          "service_miw9zp4",
        configs?.find((config) => config.key === "EMAIL_TEMPLATE_01_ID")
          ?.value || "template_bjyfjbd",
        {
          from_name: "TDC - Cao đẳng Công nghệ Thủ Đức",
          to_name: contact?.name ?? "Unknown",
          message: reply,
          reply_to: contact?.email,
        },
        configs?.find((config) => config.key === "EMAIL_USER_ID")?.value ||
          "nbxhmGhQt4JpgZSUa"
      )
      .then(() => {
        toast.current.show({
          severity: "sucsess",
          summary: "Reply to contact",
          detail: "Reply successfully",
          life: 3000,
        });
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "Reply to contact",
          detail: "Reply unsuccessfully. Somwthing went wrong",
          life: 3000,
        });
      })
      .finally(() => {
        e.target.textContent = "Reply";
        //delete contact
        const api = apiURL + "contacts/" + contact.id;
        fetch(api, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }).finally(() => {
          navigate("./..");
        });
      });
  };

  return (
    <Modal show={true} size="xl">
      <Toast ref={toast} />
      <ModalHeader>
        ADMINISTRATION - REPLY CONTACT
        <CloseButton onClick={() => navigate("./..")} />
      </ModalHeader>

      <ModalBody>
        <div className="row mb-3">
          <div className="col-md-6">
            <Chip className="m-1" label={<b>Contact from</b>} />
            <input
              className="form-control"
              readOnly
              value={(contact && contact.name) || "Unknown"}
            />
          </div>
          <div className="col-md-6">
            <Chip className="m-1" label={<b>Sent at</b>} />

            <input
              className="form-control"
              readOnly
              value={
                (contact &&
                  contact.updated_at &&
                  getDate(contact.updated_at)) ||
                (contact &&
                  contact.created_at &&
                  getDate(contact.created_at)) ||
                "Unknown"
              }
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <Chip className="m-1" label={<b>From email</b>} />

            <input
              className="form-control"
              readOnly
              value={(contact && contact.email) || "Unknown"}
            />
          </div>
          <div className="col-md-6">
            <Chip className="m-1" label={<b>Phone number</b>} />

            <input
              className="form-control"
              readOnly
              value={(contact && contact.phone) || "Unknown"}
            />
          </div>
        </div>

        <div className="row mb-3">
          <small>
            <i>* Information for enrollment</i>
          </small>
          <div className="col-md-6">
            <Chip className="m-1" label={<b>Math</b>} />

            <input
              className="form-control"
              readOnly
              value={(contact && contact.math) || "Unknown"}
            />
          </div>
          <div className="col-md-6">
            <Chip className="m-1" label={<b>English</b>} />

            <input
              className="form-control"
              readOnly
              value={(contact && contact.eng) || "Unknown"}
            />
          </div>
        </div>

        <Chip className="m-1" label={<b>Content</b>} />

        <textarea
          className="form-control mb-2"
          rows={5}
          readOnly
          defaultValue={contact && contact.content}
        ></textarea>

        <Chip className="m-1" label={<b>Reply</b>} />

        <textarea
          onChange={(e) => setReply(e.target.value)}
          className="form-control"
          rows={5}
        ></textarea>
      </ModalBody>

      <ModalFooter>
        {reply && (
          <button onClick={handleReply} className="btn text-danger">
            Reply
          </button>
        )}
      </ModalFooter>
    </Modal>
  );
}
