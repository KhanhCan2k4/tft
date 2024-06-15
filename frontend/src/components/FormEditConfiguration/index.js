import { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom'
import AdminLayout from "../../layouts/AdminLayout";
import { apiURL } from "../../App";

function FormEditConfiguration() {

    const location = useLocation();
    const [configuration, setConfiguration] = useState();

    useEffect(() => {
        const configuration = location.state;
        setConfiguration(configuration);
    }, []);

    const alertSuccess = useRef();
    const alertDanger = useRef();

    const handleEdit = (event) => {
        const api = apiURL + `configurations/${configuration.id}`;
        event.target.textContent = "Đang tải...";

        //bo gia tri cu
        alertSuccess.current.textContent = '';
        alertDanger.current.innerHTML = '';

        const data = {
            key: configuration.key,
            value: configuration.value
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

                        messages?.key?.forEach(error => {
                            message += error + "<br/>"
                        });

                        messages?.value?.forEach(error => {
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
                            <h1>SỬA BẢNG ĐIỀU KIỂN</h1>
                            <div ref={alertSuccess} className="alert alert-success"></div>
                            <div ref={alertDanger} className="alert alert-danger"></div>
                            <div>
                                <div className="mb-3">
                                    <label htmlFor="key" className="form-label">Key</label>
                                    <input value={configuration && configuration.key} onChange={(event) => setConfiguration({ ...configuration, key: event.target.value })} type="text" id="key" name="key" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="value" className="form-label">Value</label>
                                    <input value={configuration && configuration.value} onChange={(event) => setConfiguration({ ...configuration, value: event.target.value })} type="text" id="value" name="value" />
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

export default FormEditConfiguration;