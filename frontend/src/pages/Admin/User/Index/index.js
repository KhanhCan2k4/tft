import { useContext, useEffect, useRef, useState } from "react";
import AdminLayout from "../../../../layouts/AdminLayout";
import { apiURL, ConfigContext, getCourse, getDate } from "../../../../App";
import { Toast } from "primereact/toast";
import AdminSubPage from "../../../../subpages/Admin";
import emailjs from "emailjs-com";
import { Select } from "antd";
import { Tooltip } from "@mui/material";
import { PieChart } from "../../../../components/DisplayChart";
import { CloseButton, Modal, ModalBody, ModalHeader } from "react-bootstrap";

export function AdminUserIndex() {
  //refs
  const toast = useRef();
  const configs = useContext(ConfigContext);

  //states
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [paginatedUsers, setPaginatedUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  //set title
  useEffect(() => {
    document.title = "Administration Users";
  }, []);

  useEffect(() => {
    getFromDatabase();
  }, []);

  useEffect(() => {
    let users = allUsers.filter((user) => user.class === classes[index]); //filter based on class name

    if (users.length === 0) {
      //no found users
      users = allUsers;
    }
    setUsers(users);
    setTotal(users.length);
    setPage(1);
    setPaginatedUsers(users.slice((page - 1) * 5, (page - 1) * 5 + 5));
  }, [index]);

  //get these users and paginate them
  useEffect(() => {
    setPaginatedUsers(users.slice((page - 1) * 5, (page - 1) * 5 + 5));
  }, [page]);

  function getFromDatabase(hasGrade = false) {
    fetch(apiURL + "users" + (hasGrade ? "/grades" : ""))
      .then((res) => res.json())
      .then((users) => {
        setAllUsers(
          users.map((user) => ({
            ...user,
            course: getCourse(user.class),
            created_at: getDate(user.created_at),
            updated_at: getDate(user.updated_at),
          }))
        );

        setUsers(
          users.map((user) => ({
            ...user,
            course: getCourse(user.class),
            created_at: getDate(user.created_at),
            updated_at: getDate(user.updated_at),
          }))
        );

        setPaginatedUsers(
          users
            .map((user) => ({
              ...user,
              course: getCourse(user.class),
              created_at: getDate(user.created_at),
              updated_at: getDate(user.updated_at),
            }))
            .slice(0, 5)
        );

        setIndex(0);
        setTotal(users.length);
        setPage(1);

        const classes = [];
        classes.push("ALL");
        for (let i = 0; i < users.length; i++) {
          if (!classes.includes(users[i] && users[i].class)) {
            classes.push(users[i].class);
          }
        }

        setClasses(classes);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function deleteUser(index) {
    emailjs
      .send(
        configs?.find((config) => config.key === "EMAIL_SERVICE_ID")?.value ||
          "service_miw9zp4",
        configs?.find((config) => config.key === "EMAIL_TEMPLATE_01_ID")
          ?.value || "template_bjyfjbd",
        {
          from_name: "TDC - Cao đẳng Công nghệ Thủ Đức",
          to_name: users[index]?.name ?? "Unknown",
          message:
            "Tải khoản " +
            users[index]?.name +
            " - " +
            users[index]?.mssv +
            " hiện không thể hoạt động tại TFT",
          reply_to: users[index]?.mssv + "@mail.tdc.edu.vn",
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
      });

    const url = `${apiURL}users/${users[index].id}`;
    fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(() => {
        getFromDatabase();
      })
      .catch((err) => {
        console.log("remove user", err);
      });
  }

  const getAnalysList = () => {
    const list = [0, 0, 0, 0, 0];

    allUsers.forEach((user) => {
      if (user.class === classes[index] || classes[index] === "ALL") {
        if (user.grade >= 9) {
          list[0]++;
        } else if (user.grade >= 8) {
          list[1]++;
        } else if (user.grade >= 7) {
          list[2]++;
        } else if (user.grade >= 5) {
          list[3]++;
        } else {
          list[4]++;
        }
      }
    });

    return list;
  };

  return (
    <AdminLayout
      activeIndex={1}
      slot={
        <div className="admin-user-index">
          <Toast ref={toast} />
          <AdminSubPage
            title="ADMINISTRATION - USERS"
            subTitle="STUDENTS AT TFT"
            columnTitles={[
              "STUDENT ID",
              "NAME",
              "CLASS",
              "COURSE",
              "GRADE",
              "JOINT AT",
              "RECENT UPDATE",
            ]}
            list={paginatedUsers}
            columns={[
              "mssv",
              "name",
              "class",
              "course",
              "grade",
              "created_at",
              "updated_at",
            ]}
            total={total}
            page={page}
            handleRefresh={getFromDatabase}
            handlePagination={setPage}
            handleDelete={deleteUser}
            headerComponent={() => (
              <div className="row">
                <div className="offset-md-7 col-md-3 text-center">
                  <Select
                    size="small"
                    className="w-100 h-100"
                    defaultValue={classes && classes.length >= 1 && classes[0]}
                    value={index ?? 0}
                    onChange={(index) => setIndex(index)}
                    options={
                      classes &&
                      classes.map((_class, index) => ({
                        label: _class,
                        value: index,
                      }))
                    }
                  />
                </div>

                <div className="col-md-2 text-center">
                  <Tooltip title="Refresh and update grades">
                    <button
                      onClick={() => getFromDatabase(true)}
                      className="btn mb-1 mx-1"
                    >
                      <i className="bi bi-arrow-clockwise text-danger"></i>
                    </button>
                  </Tooltip>

                  <Tooltip title="View grades analysis">
                    <button
                      onClick={() => setShow(true)}
                      className="btn mb-1 mx-1"
                    >
                      <i className="bi bi-pie-chart-fill text-danger"></i>
                    </button>
                  </Tooltip>
                </div>
              </div>
            )}
          />

          <Modal show={show} onHide={() => setShow(false)} size="lg">
            <ModalHeader>
              GRADES ANALYSIS FOR CLASS &ensp;
              <b>
                <i>{classes && classes[index]}</i>
              </b>
              <CloseButton onClick={() => setShow(false)} />
            </ModalHeader>

            <ModalBody>
              <PieChart
                columnLabels={[
                  "SV xếp loại xuất sắc",
                  "SV xếp loại giỏi",
                  "SV xếp loại khá",
                  "SV xếp loại trung bình",
                  "SV xếp loại yếu",
                ]}
                list={getAnalysList()}
              />
            </ModalBody>
          </Modal>
        </div>
      }
    />
  );
}
