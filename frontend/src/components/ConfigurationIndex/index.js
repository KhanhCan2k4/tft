import { useState, useEffect } from "react";
import { apiURL } from "../../App";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const initConfiguration = {
    id: 0,
    key: "hihi",
    value: "huhu",
};


function ConfigurationIndex() {

    const [configurations, setConfigurations] = useState([initConfiguration]);

    useEffect(() => {
        getDataFromDatabase();
    }, [])

    // hiển thị danh sách
    function getDataFromDatabase() {
        const api = apiURL + "configurations"
        fetch(api)
            .then((res) => res.json())
            .then((configurations) => {
                // setConfigurations(Object.values(configurations)); có phân trang
                setConfigurations(configurations);
            })
            .catch((err) => {
                toast.error(err);
                setConfigurations([initConfiguration]);
            });
    }

    // XÓA
    const handleDelete = (event) => {
        if (window.confirm("Are you sure you want to delete")) {
            const id = event.target.dataset.id;
            // event.target.innerHTML = "Đang tải...";
            const api = apiURL + `configurations/${id}`;
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
            <h1>Bảng điều khiển</h1>

            <div className="row">
                <div className="col">
                    <Link to={"./them"} className="btn btn-outline-success my-3">Thêm bảng điều khiển mới</Link>
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
                            <td>Key</td>
                            <td>Value</td>
                            <td className="text-center" colSpan={2}>Action</td>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {configurations.map(
                            (configuration, index) => (
                                <tr key={index}>
                                    <td>{configuration['id']}</td>
                                    <td>{configuration['key']}</td>
                                    <td>{configuration['value']}</td>
                                    <td>
                                        <Link state={configuration} to={"./chinh-sua"} className="btn btn-outline-warning"><i className="bi bi-pencil-square"></i></Link>
                                    </td>
                                    <td>
                                        <button data-id={configuration['id']} onClick={handleDelete} className="btn btn-outline-danger"><i className="bi bi-x-circle"></i></button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ConfigurationIndex;