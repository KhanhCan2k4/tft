import { useEffect, useRef, useState } from "react";
import {
  CloseButton,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "react-bootstrap";
import { ExcelRenderer, OutTable } from "react-excel-renderer";
import { apiURL } from "../../../../App";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router";
import { Chip } from "@mui/material";
import { UploadFileOutlined } from "@mui/icons-material";
import { CSVLink } from "react-csv";

export default function AdminUserCreate() {
  //refs
  const toast = useRef();
  const navigate = useNavigate();

  //states
  const [excelRows, setExcelRows] = useState([]);
  const [excelCols, setExcelCols] = useState([]);
  const [exampleDatas, $] = useState([
    ["19211TT0001", "CD19TT1", "Nguyễn Văn A", 5.0],
    ["20211TT0002", "CD19TT1", "Nguyễn Thị B", 8.0],
    ["21211TT0003", "CD19TT1", "Trần Văn C", 5.9],
    ["22211TT0004", "CD19TT1", "Đỗ Văn D", 5.1],
    ["23211TT0005", "CD19TT1", "Lê Văn E", 6.0],
  ]);

  //handlers
  const handleImportData = (e) => {
    const file = e.target?.files[0];

    ExcelRenderer(file, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        resp.rows.shift();
        setExcelRows(resp.rows);
      }
    });
  };

  const handleImportUsers = (e) => {
    e.target.style.display = "none";
    const api = apiURL + "users/import";

    toast?.current?.show({
      severity: "confirm",
      summary: "Import users",
      detail: "Please wait for processing...",
      life: 30000,
    });

    const importedUsers = excelRows.map((row) => {
      return {
        mssv: row[0],
        class: row[1],
        name: row[2],
        grade: row[3],
      };
    });

    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ users: importedUsers }),
    })
      .then(() => {
        setExcelRows([]);
        setExcelCols([]);

        toast.current.show({
          severity: "sucsess",
          summary: "Import users",
          detail: "Import successfully",
          life: 3000,
        });
      })
      .catch((err) => {
        console.log("Import multi users", err);
        toast.current.show({
          severity: "error",
          summary: "Import users",
          detail: "Import failed",
          life: 3000,
        });
      })
      .finally(() => {
        navigate("./..");
      });
  };

  useEffect(() => {
    setExcelCols([
      {
        name: "STT",
        key: 0,
      },
      {
        name: "MSSV",
        key: 1,
      },
      {
        name: "CLASS",
        key: 2,
      },
      {
        name: "NAME (optional)",
        key: 3,
      },
      {
        name: "GRADE (optional)",
        key: 4,
      },
    ]);
  }, []);

  return (
    <Modal show={true} size="xl">
      <Toast ref={toast} position="center" />
      <ModalHeader>
        REGISTER AN ENTRY OF USERS
        <CloseButton onClick={() => navigate("./..")}></CloseButton>
      </ModalHeader>

      <ModalBody className="text-dark">
        <div className="row">
          <div className="col-lg-6">
            <Chip className="m-1" label={<b> Example</b>} />
            <br />

            <OutTable
              style={{ padding: "20px" }}
              data={exampleDatas}
              columns={excelCols && excelCols}
              tableClassName="data-user-table table table-striped table-bordered"
              tableHeaderRowClass="heading"
            />

            <Chip
              size="small"
              label={
                <CSVLink
                  className="text-primary mx-1"
                  headers={
                    (excelCols &&
                      excelCols.length >= 5 && [
                        excelCols[1].name,
                        excelCols[2].name,
                        excelCols[3].name,
                        excelCols[4].name,
                      ]) ||
                    []
                  }
                  data={
                    exampleDatas &&
                    exampleDatas.map((example) => ({
                      MSSV: example[0],
                      CLASS: example[1],
                      "NAME (optional)": example[2],
                      "GRADE (optional)": example[3],
                    }))
                  }
                  filename={"Example import students"}
                  style={{ textDecoration: "none", color: "#fff" }}
                >
                  Download example file
                </CSVLink>
              }
            />
          </div>

          <div className="col-lg-6">
            <Chip className="m-1" label={<b>Review data</b>} />

            <OutTable
              style={{ padding: "20px" }}
              data={excelRows && excelRows}
              columns={excelCols && excelCols}
              tableClassName="data-user-table table table-striped table-bordered"
              tableHeaderRowClass="heading"
            />

            <div className="mt-2">
              <label htmlFor="upload">
                <span className="btn text-danger" aria-hidden={true}>
                  <UploadFileOutlined />
                </span>
                <input
                  type="file"
                  onChange={handleImportData}
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  id="upload"
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <small style={{ fontSize: "0.8em" }}>
              <i>
                <span className="text-danger">* </span>Data file must contain
                user's information with columns in order. <br />
                <span className="text-danger">* </span>Data reader will ignore
                first line
              </i>
            </small>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <button className="btn text-danger" onClick={handleImportUsers}>
          Import
        </button>
      </ModalFooter>
    </Modal>
  );
}
