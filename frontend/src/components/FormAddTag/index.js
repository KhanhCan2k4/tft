import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { useNavigate } from "react-router";
import { apiURL } from "../../App";


function FormAddTag() {

    const [name, setName] = useState('');
    const navigation = useNavigate();

    const handleAdd = () => {
        const api = apiURL + "tags";
        const data = { name: name };

        fetch((api), {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
            .then((res) => res.json())
            .then(data => {
                switch (data.status) {
                    case 200:
                        navigation("/quan-tri/danh-muc")
                        alert(data.message);
                        break;
                    case 422:
                        const messages = data.message;
                        let message = "";

                        messages?.name?.forEach(error => {
                            message += error
                        });
                        alert(message);
                        break;
                    default:
                        alert("Đã có lỗi xảy ra. Thêm không thành công");
                        break;
                }
            })
    }

    return (
        <>
            <AdminLayout
                slot={
                    (
                        <>
                            <div className="container">
                                <div className="card">
                                    <div className="card-header">
                                        <h2>THÊM DANH MỤC</h2>
                                    </div>
                                    <div className="card-body">
                                        <div className="card-group">
                                            <label htmlFor="key">Tên danh mục</label>
                                            <input onChange={(event) => setName(event.target.value)} type="text" className="form-control" id="name" name="name" />
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <button onClick={handleAdd} className="btn btn-primary">THÊM</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
            >
            </AdminLayout>
        </>
    )
}

export default FormAddTag;