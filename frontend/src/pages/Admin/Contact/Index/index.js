import AdminLayout from "../../../../layouts/AdminLayout";
import { useEffect, useRef, useState } from "react";
import { apiURL, getShortDate } from "../../../../App";
import emailjs from "emailjs-com";
import { Toast } from "primereact/toast";
import AdminSubPage from "../../../../subpages/Admin";
import { getDate } from "./../../../../App";
import { CSVLink } from "react-csv";
import { Chip } from "@mui/material";
import { Tooltip } from "@mui/material";
import { CloseButton, Modal, ModalBody, ModalHeader } from "react-bootstrap";
import { LineChart } from "../../../../components/DisplayChart";
import { Select } from "antd";

const years = [];

for (let i = 2019; i <= new Date().getFullYear(); i++) {
  years.push(i);
}

export default function AdminContactIndex() {
  //REFS
  const toast = useRef();

  //STATES
  const [contacts, setContacts] = useState([]);
  const [exportYear, setExportYear] = useState(years[years.length - 1]);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);

  const [exportData, setExportData] = useState([]);
  const [exportDataContacts, setExportDataContacts] = useState([]);
  const [analysisContacts, setAnalysisContacts] = useState([]);
  const [analysisContactsWithGrade, setAnalysisContactsWithGrade] = useState(
    []
  );
  const [analysisDates, setAnalysisDates] = useState([]);

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

    getExportedContacts();
  };

  const getExportedContacts = () => {
    const api = apiURL + "contacts/export";

    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        const exportData = [];
        const exportDataWithGrade = [];
        data.forEach((contacts) => {
          exportDataWithGrade.push(
            contacts
              .filter((contact) => contact.eng && contact.math)
              .map((contact) => ({
                "Tên liên hệ": contact.name,
                "Email liên hệ": contact.email,
                "Điểm môn Toán": contact.math,
                "Điểm môn tiếng Anh": contact.eng,
                "Thời gian đăng ký":
                  (contact.updated_at && getShortDate(contact.updated_at)) ||
                  new Date().getFullYear(),
              }))
          );

          exportData.push(
            contacts.map((contact) => ({
              "Tên liên hệ": contact.name,
              "Email liên hệ": contact.email,
              "Số điện thoại": contact.phone ?? "Không cung cấp",
              "Nội dung liên hệ": contact.content,
              "Thời gian liên hệ":
                (contact.updated_at && getShortDate(contact.updated_at)) ||
                new Date().getFullYear(),
            }))
          );
        });
        setExportData(exportDataWithGrade);

        setExportDataContacts(exportData);
      });
  };

  console.log("====================================");
  console.log("c", exportDataContacts);
  console.log("====================================");

  console.log("====================================");
  console.log("g", exportData);
  console.log("====================================");

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

  //set title
  useEffect(() => {
    document.title = "Administration Contacts";
  }, []);

  useEffect(() => {
    getContactsFromDatabase();
  }, [page]);

  useEffect(() => {
    const api = apiURL + "contacts/analysis";

    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        setAnalysisContacts(data.contacts);
        setAnalysisContactsWithGrade(data.has_grade_contacts);
        setAnalysisDates(data.dates);
      });
  }, []);

  return (
    <AdminLayout
      activeIndex={4}
      slot={
        <>
          <Toast ref={toast} />
          <AdminSubPage
            title={"ADMINISTRATION - CONTACTS"}
            subTitle={"CONTACT LIST"}
            columnTitles={["NAME", "EMAIL", "SENT AT"]}
            columns={["name", "email", "created_at"]}
            list={
              contacts &&
              contacts.map((contact) => ({
                ...contact,
                created_at:
                  (contact.updated_at && getDate(contact.updated_at)) ||
                  getDate(contact.created_at),
              }))
            }
            isAbleToAdd={false}
            handleDelete={handleDeleteContact}
            handleRefresh={getContactsFromDatabase}
            handlePagination={handlePagination}
            total={total}
            page={page}
            headerComponent={() => (
              <div className="text-end d-flex gap-2 justify-content-end">
                <b className="mt-2">Export year: </b>
                <Select
                  className="mt-1"
                  style={{ width: "100px" }}
                  onChange={(v) => setExportYear(v)}
                  defaultValue={years[years.length - 1]}
                  options={years.map((y) => ({
                    label: y,
                    value: y,
                  }))}
                />

                <div>
                  <CSVLink
                    className="btn"
                    headers={[
                      "Tên liên hệ",
                      "Email liên hệ",
                      "Số điện thoại",
                      "Nội dung liên hệ",
                      "Thời gian liên hệ",
                    ]}
                    data={exportDataContacts[exportYear - 2019] ?? []}
                    filename={"Danh sách liên hệ đến TFT năm " + exportYear}
                    style={{ textDecoration: "none", color: "#fff" }}
                  >
                    <Tooltip title="Export contact list">
                      <i className="bi bi-file-earmark-spreadsheet text-danger"></i>
                    </Tooltip>
                  </CSVLink>
                </div>

                <div>
                  <CSVLink
                    className="btn"
                    headers={[
                      "Tên liên hệ",
                      "Email liên hệ",
                      "Điểm môn Toán",
                      "Điểm môn tiếng Anh",
                      "Thời gian đăng ký",
                    ]}
                    data={exportData[exportYear - 2019] ?? []}
                    filename={
                      "Danh sách điểm đăng ký chương trình TFT năm " +
                      exportYear
                    }
                    style={{ textDecoration: "none", color: "#fff" }}
                  >
                    <Tooltip title="Export grades list for enrollment">
                      <i className="bi bi-file-earmark-spreadsheet-fill text-danger"></i>
                    </Tooltip>
                  </CSVLink>
                </div>

                <div>
                  <Tooltip title="Analysis contacts in 30 days">
                    <button onClick={() => setShow(true)} className="mb-1 btn">
                      <i className="bi bi-graph-up text-danger"></i>
                    </button>
                  </Tooltip>
                </div>
              </div>
            )}
          />

          <Modal show={show} onHide={() => setShow(false)} size="xl">
            <ModalHeader>
              ANALYSIS CONTACTS <CloseButton onClick={() => setShow(false)} />
            </ModalHeader>

            <ModalBody>
              <LineChart
                firstName="Contacts"
                lastName="Contacts with grades"
                firstData={analysisContacts}
                lastData={analysisContactsWithGrade}
                columnLabels={analysisDates}
              />
            </ModalBody>
          </Modal>
        </>
      }
    />
  );
}
