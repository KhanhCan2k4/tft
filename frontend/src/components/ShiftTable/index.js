import Shift from "../Shift";


export default function ShiftTable({ shifts }) {
    return (
        <>
            <div className="panel-body">
                <table className="table fit-calendar">
                    <thead>
                        <tr>
                            <th style={{ width: "64%" }}><b>Họ &amp; Tên</b> <i>(Chức vụ)</i></th>
                            <th>
                                <div className="row">
                                    <div className="col-12">
                                        Thời gian
                                    </div>
                                    <div className="col-6">
                                        <span className="badge bg-warning">Buổi</span>
                                    </div>

                                    <div className="col-6 p-2">
                                        <span className="badge bg-info">Thứ</span>
                                    </div>
                                </div>

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {shifts && shifts.map((shift, index) => (
                            <tr key={index}>
                                <Shift shift={shift} />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}