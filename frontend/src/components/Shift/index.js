


export default function Shift({ shift }) {
    return (
        <>
            <td scope="row"><b>{shift.fullName}</b><br /><i>({shift.role})</i></td>
            <td>
                {shift.time.map((item, index) => (
                    <div key={index} className="row">
                        <div className="col-6">
                            <span className="badge bg-warning">{item.timeOfDay}</span>
                        </div>

                        <div className="col-6 p-2">
                            <span className="badge bg-info">{item.dayOfWeek}</span>
                        </div>
                    </div>
                ))}
            </td>
        </>
    )
}