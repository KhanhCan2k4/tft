import { Avatar, Chip } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import {
  CloseButton,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
import { apiURL, ConfigContext, imageURL } from "../../../../App";
import { Toast } from "primereact/toast";
import emailjs from "emailjs-com";

export function AdminUserEdit() {
  //refs
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef();

  const newPassRef = useRef();
  const reprimandRef = useRef();
  const gradeRef = useRef();
  const configs = useContext(ConfigContext);

  //states
  const [user, setUser] = useState();
  const [classes, setClasses] = useState([]);

  //handlers
  const handleCourse = (e) => {
    const _class = e.target.value;
    user.class = _class;
    user.course = +(+_class.substring(2, 4) - 18);
    user.course = user.course >= 1 ? user.course : 0;

    setUser(user);
  };

  //effects
  useEffect(() => {
    const user = location.state;

    user.course = +(+user.class.substring(2, 4) - 18);
    user.course = user.course >= 1 ? user.course : 0;
    setUser(user);
  }, []);

  useEffect(() => {
    const api = apiURL + "users/classes";

    fetch(api)
      .then((res) => res.json())
      .then((classes) => {
        setClasses(classes.filter((_class) => _class.class !== ""));
      })
      .catch((err) => {
        console.log("Fetch classes", err);
      });
  }, []);

  const handleSave = () => {
    const reprimand = reprimandRef.current?.value;

    if (reprimand) {
      emailjs.send(
        configs?.find((config) => config.key === "EMAIL_SERVICE_ID")?.value ||
          "service_miw9zp4",
        configs?.find((config) => config.key === "EMAIL_TEMPLATE_01_ID")
          ?.value || "template_bjyfjbd",
        {
          from_name: "TDC - Cao đẳng Công nghệ Thủ Đức",
          to_name: user && user.name,
          message: "ADMIN TFT NHẮC NHỞ: \n" + reprimand,
          reply_to: user && user.mssv + "@mail.tdc.edu.vn",
        },
        configs?.find((config) => config.key === "EMAIL_USER_ID")?.value ||
          "nbxhmGhQt4JpgZSUa"
      );
    }

    const grade = +gradeRef.current.value;
    if (grade && !(grade >= 0.0 && grade <= 10.0)) {
      toast?.current?.show({
        severity: "error",
        summary: "Update student's grade",
        detail: "Invalid grade",
        life: 3000,
      });
      return;
    }

    const newPass = newPassRef.current?.value;

    const api = apiURL + "users/" + user.id;
    fetch(api, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...user, newPass: newPass, grade: grade }),
    })
      .then(() => {
        navigate("./..");
      })
      .catch((err) => {
        console.log("Update user", err);
        toast?.current?.show({
          severity: "error",
          summary: "Update student's information",
          detail: "Cannot update student's information",
          life: 3000,
        });
      });
  };

  return (
    <Modal show={true} size="xl">
      <Toast ref={toast} />
      <ModalHeader>
        VIEW OR UPDATE USER'S INFORMATION
        <CloseButton onClick={() => navigate("./..")} />
      </ModalHeader>
      <ModalBody>
        <div className="row">
          <div className="col-md-6 my-md-5">
            <Chip className="m-1" label={<b>Student's avatar</b>} />
            <Avatar
              src={user && user.avatar && imageURL + user.avatar}
              alt={user && user.name}
              style={{ width: "200px", height: "200px" }}
              className="mx-auto"
            />

            <Chip className="m-1" label={<b>Reprimand via email</b>} />
            <textarea ref={reprimandRef} rows={4} className="form-control" />
          </div>

          <div className="col-md-6">
            <Chip className="m-1" label={<b>Student's name</b>} />
            <input
              value={user && user.name}
              className="form-control mb-1"
              type="text"
              disabled
            />

            <Chip className="m-1" label={<b>Student's ID</b>} />
            <input
              value={user && user.mssv}
              className="form-control mb-1"
              type="text"
              disabled
            />

            <Chip className="m-1" label={<b>Grade</b>} />
            <input
              ref={gradeRef}
              className="form-control mb-1"
              type="number"
              step={0.01}
              min={0.0}
              max={10.0}
              defaultValue={user && user.grade}
            />

            <div className="row">
              <div className="col-md-6">
                <Chip className="m-1" label={<b>Class</b>} />
                <select className="form-control mb-1" onChange={handleCourse}>
                  {classes &&
                    classes.map((_class) => (
                      <option
                        key={_class.class}
                        selected={user.class.trim() === _class.class.trim()}
                        className="form-control"
                        value={_class.class}
                      >
                        {_class.class}
                      </option>
                    ))}
                </select>
              </div>

              <div className="col-md-6">
                <Chip className="m-1" label={<b>Course</b>} />

                <input
                  className="form-control mb-1"
                  type="text"
                  value={user && user.course}
                  disabled
                />
              </div>
            </div>

            <Chip className="m-1" label={<b>Biography/Achievement</b>} />
            <textarea
              className="form-control mb-1"
              type="number"
              rows={3}
              value={(user && user.achievements) || ""}
              disabled
            />

            <Chip className="m-1" label={<b>Update New Password</b>} />
            <input
              ref={newPassRef}
              className="form-control mb-1"
              type="password"
              placeholder="Type new password"
            />
          </div>

          <div className="col-12">
            <Chip className="m-1" label={<b>Detail grade</b>} />

            <iframe
              src={
                user &&
                "http://online.tdc.edu.vn/Portlets/Uis_Myspace/Professor/Marks.aspx?StudentID=" +
                  user.mssv
              }
              title={"Detail grade"}
              className="w-100"
              style={{ height: "70vh" }}
            ></iframe>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <button onClick={handleSave} className="btn text-danger">
          Save Changes
        </button>
      </ModalFooter>
    </Modal>
  );
}
