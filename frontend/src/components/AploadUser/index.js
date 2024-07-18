import "./styles.css";
import { imageURL } from "../../App";
import { PersonCircle } from "react-bootstrap-icons";
import { Card } from "antd";
import { Tooltip } from "@mui/material";

export default function ApploadUser({ user, rank }) {
  return (
    <div className="appload-user">
      {(user && (
        <div className="appload-user">
          <>
            <Tooltip title={"Top " + (rank ?? "chưa xác định")}>
              <div className={"rank rank-" + rank}></div>
              {(user && user.avatar && user.avatar && (
                <img
                  className="avatar"
                  src={imageURL + user.avatar}
                  alt="Ảnh đại diện"
                />
              )) || <PersonCircle className="avatar" />}
            </Tooltip>
          </>

          <div>
            <Card className="appload-user-modal text-center">
              <i>Sinh viên </i>
              <br />
              <b>{user && user.name}</b>
              <Card className="appload-user-modal-body text-start">
                {user && user.achievements}
              </Card>
            </Card>
          </div>
        </div>
      )) || (
        <div className="appload-user">
          <div className={"empty rank rank-" + rank}></div>
        </div>
      )}
    </div>
  );
}
