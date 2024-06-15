import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { Popconfirm } from "antd";
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
  handleAdd = () => {},
  handleEdit = () => {},
  handleDelete = () => {},
  handlePagination = () => {},
  handleRefresh = () => {},
  page = 1,
  total = 0,
  isAbleToAdd = true,
}) {
  //refs
  const toast = useRef();
  const viewModal = useRef();

  //states
  const [activeIndex, setActiveIndex] = useState(0);
  const [show, setShow] = useState(false);

  //handlers
  const handleViewModal = (e) => {
    const index = +e.target?.value;
    setActiveIndex(index);
    setShow(true);
  };

  return (
    <div className="admin-index">
      <Toast ref={toast} />
      <h1>{title}</h1>

      <Badge bg="danger" pill>
        {subTitle}
      </Badge>
      <div className="list">
        <Table stickyHeader className="bg-white">
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
                    <TableSortLabel direction={"asc"}>
                      <b>{col}</b>
                    </TableSortLabel>
                  </TableCell>
                ))}

              <TableCell align={"left"} padding={"normal"} sortDirection={true}>
                <TableSortLabel colSpan={2} direction={"asc"}>
                  <b>{"ACTIONS"}</b>
                  <button onClick={handleRefresh} className="btn btn-outline-dark mx-2 bi bi-arrow-clockwise"></button>
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {list &&
              list.map((item, index) => (
                <TableRow key={index}>
                  {columns &&
                    columns.map((c, index) => (
                      <TableCell key={index}>{item[c]}</TableCell>
                    ))}
                  <TableCell>
                    <Link
                      className="mx-2 btn btn-outline-dark"
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
                      <button className="mx-2 btn btn-outline-danger">
                        <i className="bi bi-eraser-fill"></i>
                      </button>
                    </Popconfirm>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <div className="my-pagination my-3">
          <Pagination
            defaultPage={page}
            onChange={(e, page) => handlePagination(page)}
            count={Math.ceil(total / 5)}
            variant="outlined"
            color="error"
          />
        </div>

        {isAbleToAdd && (
          <div className="text-end m-3">
            <Link to={"./create"} className="btn btn-outline-danger">
              ADD NEW
            </Link>
          </div>
        )}
      </div>

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
