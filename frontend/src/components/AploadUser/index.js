import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import "./styles.css";
import { Avatar } from "@mui/material";
import { imageURL } from "../../App";

export default function ApploadUser({ user, rank }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className="appload-user">
      { user && (
        <div
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
          className="appload-user"
        >
          <Tooltip title={"Top " + rank}>
            <div className={"rank rank-" + rank}></div>
            {/* <Avatar className="avatar"/> */}
            <img className="avatar"  src={user && user.avatar && imageURL + user.avatar || ""} alt="" />
          </Tooltip>
          {open && <Modal user={user}/>}
        </div>
      ) || (
        <div className="appload-user">
          <div className={"empty rank rank-" + rank}></div>
        </div>
      )}
    </div>
  );
}

function Modal({user}) {
  return (
    <div className="appload-user-modal">
      <h5 className="modal-title" id="exampleModalLabel">
        <i>Sinh viên</i>
        <br /> <b>{user && user.name}</b>
      </h5>
      <hr />

      <p className="modal-body">
        {user && user.achievements}
      </p>
    </div>
  );
}
