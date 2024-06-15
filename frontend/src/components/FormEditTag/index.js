import { useLocation } from "react-router";
import AdminLayout from "../../layouts/AdminLayout";
import { useEffect, useRef, useState } from "react";
import { apiURL } from "../../App";

function FormEditTag() {

    const location = useLocation();
    const [tag, setTag] = useState();

    useEffect(() => {
        const tag = location.state;
        setTag(tag);
    }, []);

    const alertSuccess = useRef();
    const alertDanger = useRef();

    const handleEdit = (event) => {
        const api = apiURL + `tags/${tag.id}`;
        event.target.textContent = "Đang tải...";

        //bo gia tri cu
        alertSuccess.current.textContent = '';
        alertDanger.current.innerHTML = '';

        const data = {
            name: tag.name,
        }

        console.log(data);

        fetch(api, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then(data => {
                switch (data.status) {
                    case 200:
                        alertSuccess.current.textContent = data.message;
                        break;
                    case 422:
                        const messages = data.message;
                        let message = "";

                        messages?.name?.forEach(error => {
                            message += error + "<br/>"
                        });
                        alertDanger.current.innerHTML = message;
                        break;
                    default:
                        alert("Đã có lỗi xảy ra. Sửa không thành công");
                        break;
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                event.target.textContent = "Sửa";
            });
    }

    return (
        <>
            <AdminLayout slot={
                (
                    <>
                        <div className="container">
                            <h1>SỬA DANH MỤC</h1>
                            <div ref={alertSuccess} className="alert alert-success"></div>
                            <div ref={alertDanger} className="alert alert-danger"></div>
                            <div>
                                <div className="mb-3">
                                    <label htmlFor="key" className="form-label">Tên danh mục</label>
                                    <input value={tag && tag.name} onChange={(event) => setTag({ ...tag, name: event.target.value })} type="text" id="name" name="name" />
                                </div>
                                <button onClick={handleEdit} className="btn btn-primary">Sửa</button>
                            </div>
                        </div>
                    </>
                )
            }>
            </AdminLayout>

        </>
    )
}

export default FormEditTag;