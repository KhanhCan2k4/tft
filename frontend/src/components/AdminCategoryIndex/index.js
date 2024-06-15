import { Link } from "react-router-dom";
import { apiURL } from "../../App";
import { useEffect, useState } from "react";

const initCategory = {
    id: 0,
    name: "hihi",
    created_at: "14/05/2024",
    updated_at: "14/05/2024",
}

function AdminCategoryIndex() {

    const [categories, setCategories] = useState([initCategory]);

    useEffect(() => {
        getDataFromDatabase();
    }, [])

    // hiển thị danh sách
        function getDataFromDatabase() {
            const api = apiURL + "tags";
            fetch(api)
            .then((res) => res.json())
            .then((categories) => {
                setCategories(categories);
            })
            .catch((err) => {
                alert(err);
                setCategories([initCategory])
            });
        }

        //  xóa
        const handleDelete = (event) => {
            if (window.confirm("Bạn chắc chắn xóa???")) {
                const id = event.target.dataset.id;
                // event.target.innerHTML = "Đang tải...";
                const api = apiURL + `tags/${id}`;
                fetch(api, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                })
                    .then((res) => res.json())
                    .then(() => {
                        getDataFromDatabase();
                    })
                    .catch((err) => { });
    
                console.log(id);
            }
        }

    return (
        <>
            <h1>Quản lý danh mục</h1>

            <div className="row">
                <div className="col">
                    <Link to={"./them"} className="btn btn-outline-success my-3">Thêm danh mục mới</Link>
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
                            <td>Tên danh mục</td>
                            <td>Ngày thêm</td>
                            <td>Lần cập nhật gần nhất</td>
                            <td className="text-center" colSpan={2}>Action</td>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {categories.map(
                            (category, index) => (
                                <tr key={index}>
                                    <td>{category['id']}</td>
                                    <td>{category['name']}</td>
                                    <td>{category['created_at']}</td>
                                    <td>{category['updated_at']}</td>
                                    <td>
                                        <Link to={"./chinh-sua"} state={category} className="btn btn-outline-warning"><i className="bi bi-pencil-square"></i></Link>
                                    </td>
                                    <td>
                                        <a data-id={category['id']} onClick={handleDelete} className="btn btn-outline-danger"><i className="bi bi-x-circle"></i></a>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default AdminCategoryIndex;