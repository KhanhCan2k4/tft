import AdminPostIndex from "../../components/AdminPostIndex";
import AdminLayout from "../../layouts/AdminLayout";

function AdminPosts() {

    return (
        <AdminLayout slot={
            (
                <>
                    <div className="container">
                        <AdminPostIndex />
                    </div>
                </>
            )
        }>
        </AdminLayout>
    )
}

export default AdminPosts;