import { useEffect, useRef, useState } from "react";
import { json, useLocation } from "react-router-dom"

const initUser = {
  id: 0,
  name: "Unknown User",
}

export default function UserUpdate() {

  const location = useLocation();
  const inputName = useRef();

  const [user, setUser] = useState(initUser);

  useEffect(() => {
    setUser(location.state);
    location.pathname = "http://localhost:8000";
  }, [])

  function upDateUser() {
    const fakeUser = { ...user };

    fakeUser.name = inputName.current.value;
    // fakeUser.email = in

    setUser(fakeUser);

  }

  function submitUpdate() {
    const url =`http://localhost:8000/api/users/${user.id}`;
    console.log(url);
    fetch(url, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(user)
    })
    .then(res=> res.json())
      .then(data => {
        console.log(data);
        console.log("Update successfully");
      })
      .catch((err) => {
        console.log(err);
        console.log("Update Unsuccessfully");
      })
  }

  console.log(JSON.stringify(user));

  return <>
    <div className="container">
      <h1 className="py-5">Edit User</h1>
      <div className="form-group pb-3">
        <label for="idUser">Số thứ tự</label>
        <input type="number" className="form-control" id="idUser" name="idUser" value={user['id']} disabled />
      </div>
      <div className="form-group pb-3">
        <label for="nameUser">Tên sinh viên</label>
        <input ref={inputName} onInput={() => upDateUser()} type="text" className="form-control" id="nameUser" name="nameUser" value={user['name']} />
      </div>
      <div className="form-group pb-3">
        <label for="exampleInputEmail1">Địa chỉ email</label>
        <input type="email" className="form-control" id="exampleInputEmail1" name="email" value={user['email']} />
      </div>
      <div className="form-group pb-3">
        <label for="position">Chức vụ</label><br />
        <select className="form-select" name="position" id="position">
          <option value="1">Sinh viên</option>
          <option value="2">Trợ giảng</option>
          <option value="3">Giảng viên</option>
          <option value="4">Cố vấn học tập</option>
        </select>
      </div>
      <div className="form-group pb-3">
        <label for="courses">Khóa</label>
        <input type="number" className="form-control" id="courses" name="courses" min={1} max={5} step={1} />
      </div>
      <button onClick={() => submitUpdate()} className="btn btn-primary">Comfirm</button>
    </div>
  </>;
}
