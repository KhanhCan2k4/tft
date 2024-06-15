import { Avatar } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {
  CloseButton,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
import { apiURL, imageURL } from "../../../../App";
import { Toast } from "primereact/toast";

export function AdminUserEdit() {
  //refs
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef();

  const newPassRef = useRef();

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
    const newPass = newPassRef.current.value;

    if (newPass) {
      setUser({ ...user, newPass: newPass });
    }

    console.log(user);

    //validate
    if (user.name.length < 6) {
      toast.current.show({
        severity: "error",
        summary: "Update",
        detail: "Updates failed. Name is too short",
        life: 3000,
      });
      return;
    }

    if (user.name.length > 50) {
      toast.current.show({
        severity: "error",
        summary: "Update",
        detail: "Updates failed. Name is too long",
        life: 3000,
      });
      return;
    }

    const api = apiURL + "users/" + user.id;

    fetch(api, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .catch((err) => {
        console.log("Update user", err);
      })
      .finally(() => {
        navigate("./..");
      });
  };

  return (
    <Modal show={true} size="xl">
      <Toast ref={toast} />
      <ModalHeader>
        <h5>VIEW OR UPDATE USER'S INFORMATION</h5>
        <CloseButton onClick={() => navigate("./..")} />
      </ModalHeader>
      <ModalBody>
        <div className="row">
          <div className="offset-md-3 col-md-6 my-5">
            <Avatar
              src={user && user.avatar && imageURL + user.avatar}
              alt={user && user.name}
              style={{ width: "200px", height: "200px" }}
              className="mx-auto"
            />
          </div>
          <div className="col-md-3"></div>

          <div className="col-md-2 mt-3">Name</div>
          <div className="col-md-10 mt-3">
            <input
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="form-control"
              defaultValue={user && user.name}
              type="text"
            />
          </div>

          <div className="col-md-2 mt-3">Course</div>
          <div className="col-md-10 mt-2">
            <input
              className="form-control"
              type="text"
              value={user && user.course}
            />
          </div>

          <div className="col-md-2 mt-2">Class</div>
          <div className="col-md-10 mt-2">
            <select className="form-control" onChange={handleCourse}>
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

          <div className="col-md-2 mt-2">Student ID</div>
          <div className="col-md-10">
            <input
              value={user && user.mssv}
              className="form-control mt-2"
              type="text"
            />
          </div>

          <div className="col-md-2 mt-2">Update New Grade</div>
          <div className="col-md-10 mt-2">
            <input
              onChange={(e) => setUser({ ...user, grade: e.target.value })}
              className="form-control"
              type="number"
              min={0}
              max={10}
              step={0.01}
              placeholder="Type new grade"
            />
          </div>

          <div className="col-md-2 mt-2">Update New Password</div>
          <div className="col-md-10 mt-2">
            <input
              ref={newPassRef}
              className="form-control"
              type="password"
              placeholder="Type new password"
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <button onClick={handleSave} className="btn btn-danger">
          Save Changes
        </button>
      </ModalFooter>
    </Modal>
  );
}
