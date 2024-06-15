import {
  Badge,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "react-bootstrap";
import AdminLayout from "../../../../layouts/AdminLayout";
import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { apiURL } from "../../../../App";
import emailjs from "emailjs-com";
import { Toast } from "primereact/toast";
import AdminSubPage from "../../../../subpages/Admin";
import DisplayChart from "../../../../components/DisplayChart";

export default function AdminContactIndex() {
  //REFS
  const viewModal = useRef();
  const toast = useRef();

  //STATES
  const [contacts, setContacts] = useState([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [reply, setReply] = useState("");

  //HANDLERS
  const getContactsFromDatabase = () => {
    const api = apiURL + "contacts/pagination/" + page;

    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        setContacts(data.contacts);
        setTotal(data.total);
      })
      .catch((err) => {
        console.log("fetch contact", err);
      });
  };

  const handleViewModal = (e) => {
    const index = +e.target?.value;
    setActiveIndex(index);
    setShow(true);
  };

  const handleReply = (e) => {
    e.target.textContent = "Loading..";
    emailjs
      .send(
        "service_miw9zp4",
        "template_bjyfjbd",
        {
          from_name: "TDC - Cao đẳng Công nghệ Thủ Đức",
          to_name: contacts[activeIndex]?.name ?? "Unknown",
          message: reply,
          reply_to: contacts[activeIndex]?.email,
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
        handleDeleteContact(
          contacts && contacts[activeIndex] && contacts[activeIndex].id,
          true
        );
        setShow(false);
      });
  };

  const handleDeleteContact = (index) => {
    emailjs
      .send(
        "service_miw9zp4",
        "template_bjyfjbd",
        {
          from_name: "TDC - Cao đẳng Công nghệ Thủ Đức",
          to_name: contacts[index]?.name ?? "Unknown",
          message: "Xin lỗi! TDC xin phép từ chối phản hồi",
          reply_to: contacts[index]?.email,
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
      });

    //delete contact
    const api = apiURL + "contacts/" + contacts[index].id;
    fetch(api, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        getContactsFromDatabase();
      })
      .catch((err) => {
        console.log("Contact remove: ", err);
      });
  };

  const handlePagination = (page) => {
    setPage(page);
  };

  useEffect(() => {
    getContactsFromDatabase();
  }, [page]);

  return (
    <AdminLayout
      activeIndex={4}
      slot={
        <>
          <Toast ref={toast} />
          <AdminSubPage
            title={"ADMISTRATION - CONTACTS"}
            subTitle={"CONTACT LIST"}
            columnTitles={["NAME", "EMAIL", "SENT AT"]}
            columns={["name", "email", "created_at"]}
            list={contacts}
            isAbleToAdd={false}
            handleDelete={handleDeleteContact}
            handleRefresh={getContactsFromDatabase}
            handlePagination={handlePagination}
            total={total}
            page={page}
          />

        
        </>
      }
    />
  );
}
