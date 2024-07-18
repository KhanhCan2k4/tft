import { Toast } from "primereact/toast";
import AdminLayout from "../../../../layouts/AdminLayout";
import { useEffect, useRef, useState } from "react";
import { apiURL, fileURL } from "../../../../App";
import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Button, Card, Popconfirm } from "antd";
import {
  Badge,
  CloseButton,
  Modal,
  ModalBody,
  ModalHeader,
} from "react-bootstrap";
import { Parser } from "html-to-react";
import { FileEarmarkArrowUpFill } from "react-bootstrap-icons";

const TFT_PROGRAM_TYPE = "TFT_PROGRAM_TYPE";
const TFT_PROGRESS_TYPE = "TFT_PROGRESS_TYPE";

export default function AdminCurriculumIndex() {
  //refs
  const toast = useRef();

  //states
  const [curriculums, setCurriculums] = useState([]);

  //states
  const [show, setShow] = useState(false);
  const [data, setData] = useState();

  //handlers
  const handleShow = (data) => {
    setData(data);
    setShow(true);
  };

  const getCurriculums = () => {
    const api = apiURL + "curriculums";

    fetch(api)
      .then((res) => res.json())
      .then((curriculums) => {
        const cs = [];

        for (let year = new Date().getFullYear() + 1; year >= 2019; year--) {
          const thisYearCurriculum = curriculums.find(
            (curriculum) => curriculum.course === year
          );
          if (thisYearCurriculum) {
            cs.push(thisYearCurriculum);
          } else {
            cs.push({
              course: year,
              program: "",
              progress: "",
            });
          }
        }

        setCurriculums(cs);
      })
      .catch((err) => {
        console.log("fetch curriculums error: ", err);
      });
  };

  const handleUpload = (year, type, e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    let api = "";
    switch (type) {
      case TFT_PROGRAM_TYPE:
        api = apiURL + "curriculums/program/" + year;
        break;

      case TFT_PROGRESS_TYPE:
        api = apiURL + "curriculums/progress/" + year;
        break;

      default:
        break;
    }

    fetch(api, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          toast?.current?.show({
            severity: "success",
            summary: "Upload file",
            detail: "Upload file successfully",
            life: 3000,
          });
          getCurriculums();
        } else {
          toast?.current?.show({
            severity: "error",
            summary: "Upload file",
            detail: "Upload file unsuccessfully",
            life: 3000,
          });
        }
      })
      .catch((err) => {
        console.log("upload file in curriculum failed", err);
        toast?.current?.show({
          severity: "error",
          summary: "Upload file",
          detail: "Upload file unsuccessfully",
          life: 3000,
        });
      })
      .finally(() => {
        if (e) {
          e.target.value = "";
        }
      });
  };

  const handleRemove = (year, type) => {
    let api = "";
    switch (type) {
      case TFT_PROGRAM_TYPE:
        api = apiURL + "curriculums/program/" + year;
        break;

      case TFT_PROGRESS_TYPE:
        api = apiURL + "curriculums/progress/" + year;
        break;

      default:
        break;
    }

    fetch(api, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          toast?.current?.show({
            severity: "success",
            summary: "Remove file",
            detail: "Remove file successfully",
            life: 3000,
          });
          getCurriculums();
        } else {
          toast?.current?.show({
            severity: "error",
            summary: "Remove file",
            detail: "Remove file unsuccessfully",
            life: 3000,
          });
        }
      })
      .catch((err) => {
        console.log("Remove file in curriculum failed", err);
        toast?.current?.show({
          severity: "error",
          summary: "Remove file",
          detail: "Remove file unsuccessfully",
          life: 3000,
        });
      });
  };

  //effects

  //set title
  useEffect(() => {
    document.title = "Administration Curriculums";
  }, []);
  //fetch all curriculums
  useEffect(() => {
    getCurriculums();
  }, []);

  return (
    <AdminLayout
      activeIndex={5}
      slot={
        <>
          <h1>{"ADMINISTRATION - CURRICULUMS"}</h1>

          <Badge bg="danger" pill>
            {"CURRICULUM FILES AT EACH YEAR"}
          </Badge>
          <Toast ref={toast} />
          <Card>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />

                  <TableCell>
                    <Box>
                      <b>Curriculum's program</b>
                      <br />
                      <Chip label={<small>PDF file</small>} />
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box>
                      <b>Curriculum's progress</b>
                      <br />
                      <Chip label={<small>Mind map</small>} />
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {curriculums &&
                  curriculums.map((curriculum, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <Chip
                            color="primary"
                            label={<b>Course at yeat {curriculum.course}</b>}
                          />
                        </TableCell>

                        <TableCell>
                          {(curriculum && curriculum.program && (
                            <Button
                              onClick={() =>
                                handleShow({
                                  link: curriculum && curriculum.program,
                                  title:
                                    "Chương trình đào tạo khoá " +
                                    (curriculum && curriculum.course),
                                })
                              }
                            >
                              View {curriculum && curriculum.course}'s program
                              file
                            </Button>
                          )) || (
                            <small>
                              <span className="text-danger">* </span>
                              <i>Nothing to show</i>
                            </small>
                          )}

                          <br />

                          <Chip
                            size="small"
                            className="m-1"
                            label={
                              <label
                                htmlFor={
                                  "upload" + (curriculum && curriculum.course)
                                }
                              >
                                <span
                                  className="text-primary"
                                  aria-hidden={true}
                                >
                                  Add new file <FileEarmarkArrowUpFill />
                                </span>
                                <input
                                  type="file"
                                  onChange={(
                                    e,
                                    year = curriculum && curriculum.course
                                  ) => handleUpload(year, TFT_PROGRAM_TYPE, e)}
                                  accept="application/pdf"
                                  id={
                                    "upload" + (curriculum && curriculum.course)
                                  }
                                  style={{ display: "none" }}
                                />
                              </label>
                            }
                          />

                          {curriculum && curriculum.program && (
                            <Chip
                              size="small"
                              className="m-1"
                              label={
                                <Popconfirm
                                  title=" Remove file"
                                  description="Do you want to remove this file?"
                                  onConfirm={() =>
                                    ((year = curriculum.course) =>
                                      handleRemove(year, TFT_PROGRAM_TYPE))()
                                  }
                                >
                                  <span
                                    className="text-danger"
                                    style={{ cursor: "pointer" }}
                                  >
                                    Remove file
                                  </span>
                                </Popconfirm>
                              }
                            />
                          )}
                        </TableCell>

                        <TableCell>
                          {(curriculum && curriculum.progress && (
                            <Button
                              onClick={() =>
                                handleShow({
                                  link: curriculum && curriculum.progress,
                                  title:
                                    "Tiến trình đào tạo khoá " +
                                    (curriculum && curriculum.course),
                                })
                              }
                            >
                              View {curriculum && curriculum.course}'s progress
                              file
                            </Button>
                          )) || (
                            <small>
                              <span className="text-danger">* </span>
                              <i>Nothing to show</i>
                            </small>
                          )}

                          <br />

                          <Chip
                            size="small"
                            className="m-1"
                            label={
                              <label
                                htmlFor={
                                  "upload2" + (curriculum && curriculum.course)
                                }
                              >
                                <span
                                  className="text-primary"
                                  aria-hidden={true}
                                >
                                  Add new file <FileEarmarkArrowUpFill />
                                </span>
                                <input
                                  type="file"
                                  onChange={(e, year = curriculum.course) =>
                                    handleUpload(year, TFT_PROGRESS_TYPE, e)
                                  }
                                  accept="image/png, image/gif, image/jpeg"
                                  id={
                                    "upload2" +
                                    (curriculum && curriculum.course)
                                  }
                                  style={{ display: "none" }}
                                />
                              </label>
                            }
                          />

                          {curriculum.progress && (
                            <Chip
                              size="small"
                              className="m-1"
                              label={
                                <Popconfirm
                                  title=" Remove file"
                                  description="Do you want to remove this file?"
                                  onConfirm={() =>
                                    ((year = curriculum.course) =>
                                      handleRemove(year, TFT_PROGRESS_TYPE))()
                                  }
                                >
                                  <span
                                    className="text-danger"
                                    style={{ cursor: "pointer" }}
                                  >
                                    Remove file
                                  </span>
                                </Popconfirm>
                              }
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Card>

          <Modal show={show} size="xl" onHide={() => setShow(false)}>
            <ModalHeader>
              <h5>
                {Parser().parse(data && data.title && data.title.toUpperCase())}
              </h5>
              <CloseButton onClick={() => setShow(false)} />
            </ModalHeader>

            <ModalBody style={{ minHeight: "80vh" }}>
              <iframe
                src={data && data.link && fileURL + data.link}
                title={data && data.title}
                className="w-100"
                style={{ minHeight: "80vh" }}
              ></iframe>
            </ModalBody>
          </Modal>
        </>
      }
    />
  );
}
