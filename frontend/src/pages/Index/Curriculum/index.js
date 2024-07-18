import { Button, Card } from "antd";
import TagBack from "../../../components/TagBack";
import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { CloseButton, Modal, ModalBody, ModalHeader } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { apiURL, fileURL } from "../../../App";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router";

export default function CurriculumPage() {
  //refs
  const toast = useRef();
  const navigate = useNavigate();

  //states
  const [show, setShow] = useState(false);
  const [data, setData] = useState();
  const [curriculums, setCurriculums] = useState([]);

  const handleShow = (data) => {
    setData(data);
    setShow(true);
  };

  useEffect(() => {
    document.title = "Chương trình đào tạo CNTT TFT";
  }, []);

  //fetch all curriculums
  useEffect(() => {
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
        console.log("featch curriculums error", err);
      });
  }, []);

  return (
    <section
      className="stack-section forum-section bg-white s"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="text-center fixed-top bg-primary text-white s pt-4 pb-3"
        style={{ borderBottom: "1px solid white" }}
      >
        <h3>CHƯƠNG TRÌNH ĐÀO TẠO</h3>
        <small>
          Theo dõi chương trình cũng như tiến trình đạo tạo để hiểu rõ hơn về
          TFT
        </small>
      </div>
      <div style={{ paddingTop: "120px" }}>
        <div className="fixed-top">
          <TagBack link={"/"} />
        </div>

        <Card className="container bg-white">
          <Toast ref={toast} />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />

                <TableCell>
                  <Box>
                    <b>Chương trình đào tạo</b>
                    <br />
                    <Chip label={<small>tệp tin PDF</small>} />
                  </Box>
                </TableCell>

                <TableCell>
                  <Box>
                    <b>Tiến trình đào tạo</b>
                    <br />
                    <Chip label={<small>sơ đồ</small>} />
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {curriculums &&
                curriculums.map((curriculum, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Chip
                        color="primary"
                        label={<b>Khoá {curriculum && curriculum.course}</b>}
                      />
                    </TableCell>

                    <TableCell>
                      {(curriculum && curriculum.program && (
                        <>
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
                            Xem chương trình đào tạo khoá{" "}
                            {curriculum && curriculum.course}
                          </Button>

                          <br />
                          <Chip
                            className="my-1"
                            label={
                              <a
                                style={{ cursor: "pointer" }}
                                href={
                                  apiURL +
                                  "curriculums/program/" +
                                  (curriculum && curriculum.course)
                                }
                              >
                                Tải chương trình đào tạo
                              </a>
                            }
                          />
                        </>
                      )) || (
                        <small>
                          <span className="text-danger">* </span>
                          <i>Không thể tải chương trình đào tạo</i>
                        </small>
                      )}
                    </TableCell>

                    <TableCell>
                      {(curriculum && curriculum.progress && (
                        <>
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
                            Xem tiến trình đào tạo khoá{" "}
                            {curriculum && curriculum.course}
                          </Button>
                          <br />
                          <Chip
                            className="my-1"
                            label={
                              <a
                                style={{ cursor: "pointer" }}
                                href={
                                  apiURL +
                                  "curriculums/progress/" +
                                  (curriculum && curriculum.course)
                                }
                              >
                                Tải tiến trình đào tạo
                              </a>
                            }
                          />
                        </>
                      )) || (
                        <small>
                          <span className="text-danger">* </span>
                          <i>Không thể tải tiến trình đào tạo</i>
                        </small>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Modal show={show} size="xl" onHide={() => setShow(false)}>
        <ModalHeader>
          <h5>{data && data.title && data.title.toUpperCase()}</h5>
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
    </section>
  );
}
