
import AdminCategoryIndex from "../../components/AdminCategoryIndex";
import AdminLayout from "../../layouts/AdminLayout";

function AdminCategories() {
    return (
        <AdminLayout slot={
            (
                <>
                    <div className="container">
                        <AdminCategoryIndex />
                    </div>
                </>
            )
        }>
        </AdminLayout>
    )
}

export default AdminCategories;