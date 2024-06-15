import { Avatar, Chip } from "@mui/material";

export default function Comment({comment, beLongsToMe = false }) {
  return (
    <div className="comment mb-3">
      <div className="row">
        <div className={"col-2" + (beLongsToMe? " order-2" : "")}>
          <Avatar alt={comment && ""}></Avatar>
          <small>
            <Chip className="mt-1" label="Hihi" />
          </small>
        </div>
        <div className={"col-10" + (beLongsToMe? " order-1" : "")}>
          <textarea readOnly className="form-control">{comment && comment.content}</textarea>
          <Chip className="mt-1" label={comment && comment.created_at} />
        </div>
      </div>
    </div>
  );
}
