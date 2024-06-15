import AdminEnrollIndex from "../../components/AdminEnrollIndex";
import AdminLayout from "../../layouts/AdminLayout";

function AdminEnroll() {

    return (
        <AdminLayout slot={
            (
                <>
                    <div className="container">
                        <AdminEnrollIndex />
                    </div>
                </>
            )
        }>
        </AdminLayout>
    )
}

export default AdminEnroll;