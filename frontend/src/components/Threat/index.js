import { Avatar, Chip } from "@mui/material";
import { useRef, useState } from "react";
import { Badge } from "react-bootstrap";
import { apiURL } from "../../App";

export const TFT_LIKED_THREATS = "TFT_LIKED_THREATS";

export default function Threat({ threat, setActive, isActive = false }) {
  //refs
  const btnLike = useRef();
  const btnComment = useRef();
  const btnView = useRef();

  //handlers
  const handleLike = (e) => {
    const likedThreats =
      JSON.parse(localStorage.getItem(TFT_LIKED_THREATS)) ?? [];

    if (!likedThreats.includes(threat.id)) {
      likedThreats.push(threat.id);

      localStorage.setItem(TFT_LIKED_THREATS, JSON.stringify(likedThreats));

      const api = apiURL + "threats/like/" + threat.id;

      fetch(api)
        .then((res) => res.json())
        .then((data) => {
          threat.likes = data.like;
          e.target.className = "bi bi-heart-fill text-danger";
          btnLike.current.textContent = data.like;
        });
    }
  };

  const handleView = (e) => {
    if (isActive) {
      return;
    }
    const api = apiURL + "threats/view/" + threat.id;

    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        threat.views = data.view;
        btnView.current.textContent = data.view;
      });
  };

  function liked() {
    const likedThreats =
      JSON.parse(localStorage.getItem(TFT_LIKED_THREATS)) ?? [];

    if (likedThreats.includes(threat.id)) {
      return " text-danger bi-heart-fill";
    } 

    return " bi-heart";
  }

  return (
    <div className={"threat mb-3" + (isActive ? " active" : "")}>
      <div className="threat-header bg-white p-3">
        <div className="row">
          <div className="col-1">
            <Avatar alt="ABC" />
          </div>

          <div className="col-11">
            <Chip label={threat && threat.created_at} />
          </div>
        </div>
      </div>
      <div className="threat-body p-3">{threat && threat.content}</div>
      <div className="threat-footer bg-white py-3">
        <div className="row">
          <div className="col text-center" style={{ cursor: "pointer" }}>
            <i onClick={handleLike} className={"bi " + liked()}></i>
            <br />
            <Badge pill bg="danger">
              <span ref={btnLike} className="post-likes">
                {threat && threat.likes}
              </span>
            </Badge>
          </div>

          <div
            onClick={() => {
              handleView();
              setActive(threat);
            }}
            className="col text-center"
            style={{ cursor: "pointer" }}
          >
            <i className="bi bi-chat"></i>
            <br />
            <Badge pill bg="dark">
              <span ref={btnComment} className="post-comments">
                {threat && threat.comments.length}
              </span>
            </Badge>
          </div>

          <div className="col text-center" style={{ cursor: "pointer" }}>
            <i className="bi bi-eyeglasses"></i>
            <br />
            <Badge pill bg="dark">
              <span ref={btnView} className="post-views">
                {threat && threat.views}
              </span>
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
