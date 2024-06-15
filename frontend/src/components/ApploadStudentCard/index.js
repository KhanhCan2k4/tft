import "./styles.css";

export default function ApploadStudentCard({student}) {


    return (
        <div className="appload-card card">
            <img src={student.avatar} alt="" />
            <div className="card-body">
                <h5>{student.name}</h5>
                <p>Sinh viên khoá {student.course} / {student.class}</p>
            </div>
        </div>
    )
}