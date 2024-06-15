import { useEffect, useState } from "react";
import AdminMemberIndex from "../../components/AdminMemberIndex";
import AdminLayout from "../../layouts/AdminLayout";


function AdminMembers() {

    return (
        <AdminLayout slot={
            (
                <>
                    <div className="container">
                        <AdminMemberIndex />
                    </div>
                </>
            )
        }>
        </AdminLayout>
    )
}

export default AdminMembers;