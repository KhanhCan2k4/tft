import { Popconfirm } from "antd";
import { imageURL } from "../../App";
import { Chip } from "@mui/material";

export default function Banner({
  banner,
  handleShow,
  handelPriority,
  handleDelete,
}) {
  const options = [];

  for (let i = 1; i <= 10; i++) {
    options.push(
      <option defaultValue={i} selected={i === banner.priority} key={i}>
        {i}
      </option>
    );
  }

  return (
    <div className="banner mb-4 col-md-12">
      <Chip className="m-1" label={<b># {banner.priority}</b>} />

      <div className="row">
        <div className="col-md-8">
          <img
            className="img-fluid"
            src={banner.img && imageURL + banner.img}
            alt="banner"
          />
        </div>
        <div className="col-md-4">
          <div className="row">
            <div className="col-12 my-3">
              <button
                onClick={() => handleShow(banner)}
                className="btn"
              >
                Change Image
              </button>
            </div>
            <div className="col-12 my-3">
              <Popconfirm
                title="Remove banner"
                description="Are you sure to delete this banner?"
                onConfirm={(e) =>
                  (e.target.textContent = "Loading...") &&
                  handleDelete(banner.id)
                }
                okText="Remove"
                cancelText="Cancel"
              >
                <button className="btn text-danger">Remove</button>
              </Popconfirm>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
