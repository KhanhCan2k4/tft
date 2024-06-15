import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

  
const initUser = {
    id: 0,
    name: "Unknown User",
  }

function AdminMemberIndex() {

    const [users, setUsers] = useState([initUser]);

    useEffect(() => {
        getFromDatabase();
    },[])

    function getFromDatabase() {
        fetch("http://localhost:8000/api/users")
            .then(res => res.json())
            .then(users => {
                setUsers(users);
            })
            .catch((err) => {
                console.log(err);
                setUsers([initUser]);
            })
    }

    function deleteUser(id) {

        if (!window.confirm("Banj cos muoons xoas thanhf vieen nayf khoong?")) {
            return;
        }
    
        const url =`http://localhost:8000/api/users/${id}`;
        fetch(url, {
          method: "DELETE",
          headers: {"Content-Type": "application/json"},
        })
        .then(res=> res.json())
          .then(data => {
            console.log(data);
            console.log("Delete successfully");
            getFromDatabase();

          })
          .catch((err) => {
            console.log(err);
            console.log("Delete Unsuccessfully");
          })
      }

    return (
        <>
            <h1>Quản lý thành viên</h1>

            <div className="row">
                <div className="col">
                    <Link className="btn btn-outline-teal" to={"/quan-tri/thanh-vien/them-thong-tin-thanh-vien"}>
                        Thêm thành viên
                    </Link>
                </div>
                <div className="col text-end">
                    <a className="btn btn-outline-teal my-3 mx-2" href="http://127.0.0.1:8000/admin/products/create">Xem danh sách</a>
                    <a className="btn btn-outline-teal my-3 ms-auto" href="http://127.0.0.1:8000/admin/products/create">Xem biều đồ</a>
                </div>
                <div className="alert alert-success" >

                </div>

                <div className="alert alert-danger">

                </div>

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Họ & Tên</td>
                            <td>Ảnh đại dện</td>
                            <td>Chức vụ</td>
                            <td>Khóa</td>
                            <td>Ngày tham gia</td>
                            <td>Lần cập nhật gần nhất</td>
                            <td className="text-center" colspan="2">Action</td>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {users.map(
                            (user, index) => (
                                <tr key={index}>
                                    <td>{user['id']}</td>
                                    <td>{user['name']}</td>
                                    <td>{user['avatar']}</td>
                                    <td>{user['chuc_vu']}</td>
                                    <td>{user['khoa']}</td>
                                    <td>{user['created_at']}</td>
                                    <td>{user['updated_at']}</td>
                                    <td>
                                        <Link className="btn btn-outline-warning" to={"/quan-tri/thanh-vien/sua-thong-tin-thanh-vien"} state={user }>
                                            
                                            <i className="bi bi-pencil-square"></i>
                                        </Link>
                                    </td>
                                    <td>
                                        <span onClick={()=> deleteUser(user['id'])} className="btn btn-outline-danger"><i className="bi bi-x-circle"></i></span>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default AdminMemberIndex;