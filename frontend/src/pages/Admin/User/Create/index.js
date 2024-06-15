import { useRef, useState } from "react";
import {
  Badge,
  Button,
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

export default function AdminUserCreate() {
  //refs
  const toast = useRef();
  const navigate = useNavigate();

  //states
  const [excelRows, setExcelRows] = useState([]);
  const [excelCols, setExcelCols] = useState([]);

  const handleImportData = (e) => {
    const file = e.target?.files[0];

    ExcelRenderer(file, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        setExcelCols(resp.cols);
        setExcelRows(resp.rows);
      }
    });
  };

  const handleImportUsers = () => {
    const api = apiURL + "users/import";
    excelRows.shift();

    const importedUsers = excelRows.map((row) => {
      return {
        name: row[0],
        mssv: row[1],
        class: row[2],
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

  return (
    <Modal show={true} size="xl">
      <Toast ref={toast} />
      <ModalHeader>
        <h5>REGISTER AN ENTRY OF USERS</h5>
        <CloseButton onClick={() => navigate("./..")}></CloseButton>
      </ModalHeader>

      <ModalBody className="text-dark">
        <Badge bg="danger">Choose data file</Badge>
        <p>
          <i>
            Data file must contain user's information with columns in order.{" "}
            <br />
            Data reader will ignore first line
          </i>
        </p>

        <input
          className="mb-3 form-control"
          onChange={handleImportData}
          type="file"
          accept="application/vnd.ms-excel"
        />

        <Badge bg="danger" className="mb-3">
          Example
        </Badge>
        <div>
          <img
            className="img-fluid"
            src="./../../src/users/multi-import.png"
            alt=""
          />
        </div>

        <Badge bg="danger" className="mb-3">
          Review data
        </Badge>

        <OutTable
          style={{ padding: "20px" }}
          data={excelRows && excelRows}
          columns={excelCols && excelCols}
          tableClassName="data-user-table table table-striped table-bordered"
          tableHeaderRowClass="heading"
        />
      </ModalBody>

      <ModalFooter>
        <Button variant="danger" onClick={handleImportUsers}>
          Import
        </Button>
      </ModalFooter>
    </Modal>
  );
}
