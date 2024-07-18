import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Card, Popconfirm } from "antd";
import { useRef, useState } from "react";
import {
  Badge,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Toast,
} from "react-bootstrap";
import { Link } from "react-router-dom";

export default function AdminSubPage({
  title = "",
  subTitle = "",
  columnTitles = [],
  columns = [],
  list = [],
  handleDelete = () => {},
  handlePagination = () => {},
  handleRefresh = () => {},
  page = 1,
  total = 0,
  isAbleToAdd = true,
  headerComponent = () => {},
}) {
  //refs
  const toast = useRef();
  const viewModal = useRef();

  //states
  const [show, setShow] = useState(false);

  return (
    <div className="admin-index">
      <Toast ref={toast} />
      <h1>{title}</h1>

      {headerComponent && headerComponent()}

      <Badge bg="danger" pill>
        {subTitle}
      </Badge>
      <Card className="list">
        <div className="row">
          <div className="col my-pagination my-3">
            <Pagination
              defaultPage={page}
              onChange={(e, page) => handlePagination(page)}
              count={Math.ceil(total / 5)}
              variant="outlined"
              color="error"
            />
          </div>

          {isAbleToAdd && (
            <div className="col text-end m-3">
              <Link to={"./create"} className="btn text-danger">
                ADD NEW
              </Link>
            </div>
          )}
        </div>

        <Table className="bg-white">
          <TableHead>
            <TableRow>
              {columnTitles &&
                columnTitles.map((col, index) => (
                  <TableCell
                    key={index}
                    align={"left"}
                    padding={"normal"}
                    sortDirection={true}
                  >
                    <b>
                      <small>{col}</small>
                    </b>
                  </TableCell>
                ))}

              <TableCell align={"left"} padding={"normal"} sortDirection={true}>
                <button onClick={handleRefresh} className="btn">
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody style={{ fontSize: "0.8em" }}>
            {list &&
              list.map((item, index) => (
                <TableRow key={index}>
                  {columns &&
                    columns.map((c, index) => (
                      <TableCell key={index}>
                        <small>{item[c]}</small>
                      </TableCell>
                    ))}

                  <TableCell>
                    <Link
                      className="mx-2 btn"
                      value={index}
                      to={"./edit"}
                      state={item}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Link>

                    <Popconfirm
                      title="Remove item"
                      description="Are you sure you want to remove this one?"
                      onConfirm={() => handleDelete(index)}
                      okText="Remove"
                      cancelText="Cancel"
                    >
                      <button className="m-2 btn text-danger">
                        <i className="bi bi-eraser-fill"></i>
                      </button>
                    </Popconfirm>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>

      {/* modals */}
      <Modal
        ref={viewModal}
        onHide={() => setShow(false)}
        show={show}
        size="xl"
        className="bg-secondary"
      >
        <ModalHeader className="bg-dark text-white">VIEW DETAIL</ModalHeader>
        <ModalBody>
          <div className="row mb-3">
            <div className="col-md-6">
              <Badge className="mb-1 me-3" bg="danger" pill>
                From
              </Badge>
              <input className="form-control" readOnly value={"Unknown"} />
            </div>
            <div className="col-md-6">
              <Badge className="mb-1 me-3" bg="danger" pill>
                Sent at
              </Badge>
              <input className="form-control" readOnly value={"Unknown"} />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <Badge className="mb-1 me-3" bg="danger" pill>
                Email
              </Badge>
              <input className="form-control" readOnly value={"Unknown"} />
            </div>
            <div className="col-md-6">
              <Badge className="mb-1 me-3" bg="danger" pill>
                Phone
              </Badge>
              <input className="form-control" readOnly value={"Unknown"} />
            </div>
          </div>

          <Badge className="mb-1 me-3" bg="danger" pill>
            Content
          </Badge>
          <textarea className="form-control mb-2" rows={5} readOnly>
            {"Nothing"}
          </textarea>

          <Badge className="mb-1 me-3" bg="danger" pill>
            Reply
          </Badge>
          <textarea className="form-control" rows={5}></textarea>
        </ModalBody>
        <ModalFooter>
          <button onClick={() => setShow(false)} className="btn btn-dark">
            Close
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
