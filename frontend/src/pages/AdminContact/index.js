import { useEffect, useState } from "react";
import AdminContactIndex from "../../components/AdminContactIndex";
import AdminLayout from "../../layouts/AdminLayout";


function AdminMembers() {

    return (
        <AdminLayout slot={
            (
                <>
                    <div className="container">
                        <AdminContactIndex />
                    </div>
                </>
            )
        }>
        </AdminLayout>
    )
}

export default AdminMembers;