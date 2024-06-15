

export default function DashBoardItem({ icon, title, style }) {

    return (
        <div className="dashboard-item">
            <div className="row">
                <div className="dashboard-icon col" style={{ backgroundColor: style }}>
                    {icon}
                </div>
                <div className="dashboard-title col">
                    {title}
                </div>
            </div>
        </div>
    )
}