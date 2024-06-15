import { useEffect, useRef, useState } from "react";
import {
  Badge,
  CloseButton,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
import emailjs from "emailjs-com";
import { Toast } from "primereact/toast";
import { apiURL } from "../../../../App";

export default function AdminContactEdit() {
  const toast = useRef();

  const [contact, setContact] = useState();
  const [reply, setReply] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setContact(location.state);
  }, []);

  const handleReply = (e) => {
    e.target.textContent = "Loading..";
    emailjs
      .send(
        "service_miw9zp4",
        "template_bjyfjbd",
        {
          from_name: "TDC - Cao đẳng Công nghệ Thủ Đức",
          to_name: contact?.name ?? "Unknown",
          message: reply,
          reply_to: contact?.email,
        },
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
        <h4>ADMINISTRATION - REPLY CONTACT</h4>
        <CloseButton onClick={() => navigate("./..")} />
      </ModalHeader>

      <ModalBody>
        <div className="row mb-3">
          <div className="col-md-6">
            <Badge className="mb-1 me-3" bg="danger" pill>
              From
            </Badge>
            <input
              className="form-control"
              readOnly
              value={(contact && contact.name) || "Unknown"}
            />
          </div>
          <div className="col-md-6">
            <Badge className="mb-1 me-3" bg="danger" pill>
              Sent at
            </Badge>
            <input
              className="form-control"
              readOnly
              value={(contact && contact.created_at) || "Unknown"}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <Badge className="mb-1 me-3" bg="danger" pill>
              Email
            </Badge>
            <input
              className="form-control"
              readOnly
              value={(contact && contact.email) || "Unknown"}
            />
          </div>
          <div className="col-md-6">
            <Badge className="mb-1 me-3" bg="danger" pill>
              Phone
            </Badge>
            <input
              className="form-control"
              readOnly
              value={(contact && contact.phone) || "Unknown"}
            />
          </div>
        </div>

        <Badge className="mb-1 me-3" bg="danger" pill>
          Content
        </Badge>
        <textarea className="form-control mb-2" rows={5} readOnly>
          {(contact && contact.content) || "Nothing"}
        </textarea>

        <Badge className="mb-1 me-3" bg="danger" pill>
          Reply
        </Badge>
        <textarea
          onChange={(e) => setReply(e.target.value)}
          className="form-control"
          rows={5}
        ></textarea>
      </ModalBody>

      <ModalFooter>
        {reply && (
          <button onClick={handleReply} className="btn btn-danger">
            Reply
          </button>
        )}
      </ModalFooter>
    </Modal>
  );
}
