
import ConfigurationIndex from "../../components/ConfigurationIndex";
import AdminLayout from "../../layouts/AdminLayout";

function Configuration() {

    return (
        <AdminLayout slot={
            (
                <>
                    <div className="container">
                        <ConfigurationIndex />
                    </div>
                </>
            )
        }>
        </AdminLayout>
    )
}

export default Configuration;