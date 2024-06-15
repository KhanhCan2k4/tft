import AdminStudentPostsIndex from "../../components/AdminStudentPostIndex";
import AdminLayout from "../../layouts/AdminLayout";

function AdminStudentPost() {

    return (
        <AdminLayout slot={
            (
                <>
                    <div className="container">
                        <AdminStudentPostsIndex />
                    </div>
                </>
            )
        }>
        </AdminLayout>
    )
}

export default AdminStudentPost;