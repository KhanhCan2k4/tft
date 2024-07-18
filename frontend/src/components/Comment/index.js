import { Chip } from "@mui/material";
import { TFT_COMMENTS_THREATS, getShortDate } from "../../App";
import { CloseButton } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Popconfirm } from "antd";

export default function Comment({ comment, handleRemove, isAdmin = false }) {
  //states
  const [comments, setComments] = useState([]);

  const handleRemoveComment = () => {
    setComments(comments.filter((id) => id !== comment.id));

    localStorage.setItem(TFT_COMMENTS_THREATS, JSON.stringify(comments));

    handleRemove(comment.id);
  };

  //effects
  //get comment ids from local storage
  useEffect(() => {
    const comments =
      JSON.parse(localStorage.getItem(TFT_COMMENTS_THREATS)) ?? [];
    setComments(comments);
  }, []);

  return (
    <div className="form-control mt-3">
      {((comments && comments.includes(comment.id)) ||
        isAdmin ||
        window.location.href.includes("admin")) && (
        <Popconfirm
          title="Remove item"
          description="Are you sure you want to remove this one?"
          onConfirm={handleRemoveComment}
          okText="Remove"
          cancelText="Cancel"
        >
          <CloseButton
            style={{ fontSize: "0.5em" }}
            className="ms-auto d-block"
          />
        </Popconfirm>
      )}
      {comment && comment.content}
      <br />
      <div className="text-end">
        <Chip
          className="m-1 ms-auto"
          size="small"
          label={
            comment && comment.created_at && getShortDate(comment.created_at)
          }
        />
      </div>
    </div>
  );
}
