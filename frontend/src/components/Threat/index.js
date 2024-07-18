import { Chip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { TFT_COMMENTS_THREATS, TFT_THREATS, apiURL, getDate } from "../../App";
import { Button, Card, Popconfirm } from "antd";
import { ArrowUpRightCircleFill, Chat } from "react-bootstrap-icons";
import Comment from "../Comment";
import { TFT_REMEMBER_TOKEN } from "../../pages/Admin/Login";
import { Toast } from "primereact/toast";
import "./styles.css";
import { CloseButton } from "react-bootstrap";

export const TFT_LIKED_THREATS = "TFT_LIKED_THREATS";

export default function Threat({ threat, handleRemove, isAdmin = false }) {
  //refs
  const btnLike = useRef();
  const btnComment = useRef();
  const commentRef = useRef();
  const toast = useRef();
  const commentCardRef = useRef();

  //states
  const [showComment, setShow] = useState(false);
  const [comments, setComments] = useState(threat.comment);
  const [threats, setThreats] = useState([]);

  //handlers
  const handleLike = (e) => {
    const likedThreats =
      JSON.parse(localStorage.getItem(TFT_LIKED_THREATS)) ?? [];

    if (!likedThreats.includes(threat.id)) {
      //like
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
    } else {
      //unlike
      localStorage.setItem(
        TFT_LIKED_THREATS,
        JSON.stringify(likedThreats.filter((id) => id !== threat.id))
      );

      const api = apiURL + "threats/unlike/" + threat.id;

      fetch(api)
        .then((res) => res.json())
        .then((data) => {
          threat.likes = data.like;
          e.target.className = "bi bi-heart text-danger";
          btnLike.current.textContent = data.like;
        });
    }
  };

  function liked() {
    const likedThreats =
      JSON.parse(localStorage.getItem(TFT_LIKED_THREATS)) ?? [];

    if (likedThreats.includes(threat.id)) {
      return " text-danger bi-heart-fill";
    }

    return " bi-heart";
  }

  const handleComment = () => {
    const comment = commentRef.current.textContent;
    commentRef.current.textContent = "";

    if (!comment) {
      return;
    }

    const token = localStorage.getItem(TFT_REMEMBER_TOKEN);

    const api = apiURL + "comments";

    fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: comment,
        token: token,
        threat: threat.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          //alert
          toast?.current?.show({
            severity: "success",
            summary: "Bình luận",
            detail: "Bình luận thành công",
            life: 3000,
          });

          //save to storage
          const comments =
            JSON.parse(localStorage.getItem(TFT_COMMENTS_THREATS)) ?? [];
          comments.push(data.comment.id);

          localStorage.setItem(TFT_COMMENTS_THREATS, JSON.stringify(comments));

          //set comments
          setComments(data.comments);
          setShow(true);
          btnComment.current.textContent = data.comments.length;

          commentCardRef.current.scrollTop = 0;
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Bình luận",
            detail: "Bình luận không thành công",
            life: 3000,
          });
        }
      })
      .catch((err) => {
        console.log("add comment", err);
        toast.current?.show({
          severity: "error",
          summary: "Bình luận",
          detail: "Bình luận không thành công",
          life: 3000,
        });
      });
  };

  const handleRemoveComment = (id) => {
    const api = apiURL + "comments/" + id;

    fetch(api, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          //alert
          toast?.current?.show({
            severity: "success",
            summary: "Xoá bình luận",
            detail: "Xoá bình luận thành công",
            life: 3000,
          });

          //set comments
          btnComment.current.textContent = comments.length - 1;
          setComments(comments.filter((comment) => comment.id !== id));
          setShow(true);
        }
      });
  };

  const handleRemoveThreat = () => {
    setThreats(threats.filter((id) => id !== threat.id));
    localStorage.setItem(TFT_THREATS, JSON.stringify(threats));

    handleRemove(threat.id);
  };

  //effects
  //get threats from local storage
  useEffect(() => {
    const threats = JSON.parse(localStorage.getItem(TFT_THREATS)) ?? [];
    setThreats(threats);
  }, []);

  return (
    <Card className="mb-3 my-threat">
      <div className="row">
        {threats && threats.includes(threat.id) && (
          <Popconfirm
            title="Remove item"
            description="Are you sure you want to remove this one?"
            okText="Remove"
            cancelText="Cancel"
            onConfirm={handleRemoveThreat}
          >
            <CloseButton
              className="d-block ms-auto"
              style={{ fontSize: "0.8em" }}
            />
          </Popconfirm>
        )}

        <p>{threat && threat.content}</p>
        <div className="col-md-6">
          <Chip size="small" label={getDate(threat && threat.created_at)} />
        </div>

        <div className="col-md-6 text-end">
          <Chip
            className="ms-1"
            label={
              <span>
                <span ref={btnLike}> {threat && threat.likes}</span>{" "}
                <i onClick={handleLike} className={"bi " + liked()}></i>
              </span>
            }
          />
          <Chip
            onClick={() => setShow(!showComment)}
            className="ms-1"
            label={
              <span>
                <span ref={btnComment}>
                  {threat && threat.comments && threat.comments.length}
                </span>{" "}
                <Chat className="text-dark" />
              </span>
            }
          />
        </div>
      </div>

      <div
        ref={commentCardRef}
        className="comments mt-3"
        style={{ display: showComment ? "block" : "none" }}
      >
        <Toast position="center" ref={toast} />

        {(comments &&
          comments.length > 0 &&
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              handleRemove={handleRemoveComment}
              isAdmin={isAdmin}
            />
          ))) ||
          (threat &&
            threat.comments &&
            threat.comments.length > 0 &&
            threat.comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))) || (
            <small>
              <i>Chưa có bình luận nào</i>
            </small>
          )}
      </div>

      <div className="threat-footer bg-white pt-3">
        <div className="row">
          <div className="col-10">
            <div
              contentEditable
              ref={commentRef}
              type="text"
              className="form-control"
              maxLength={200}
            ></div>
          </div>
          <div className="col-2">
            <button className="btn pb-2" onClick={handleComment} danger>
              <ArrowUpRightCircleFill />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
