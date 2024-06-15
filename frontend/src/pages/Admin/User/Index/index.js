import { useEffect, useRef, useState } from "react";
import AdminLayout from "../../../../layouts/AdminLayout";
import { apiURL } from "../../../../App";
import { Toast } from "primereact/toast";
import "./styles.css";
import AdminSubPage from "../../../../subpages/Admin";
import emailjs from "emailjs-com";
import { PieChart } from "../../../../components/DisplayChart";

export function AdminUserIndex() {
  //refs
  const toast = useRef();

  //states
  const [users, setUsers] = useState([]);

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getFromDatabase();
  }, [page]);

  function getFromDatabase() {
    fetch(apiURL + "users/pagination/" + page)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
        setTotal(data.total);
      })
      .catch((err) => {
        console.log(err);
        setUsers([]);
        setTotal(0);
      });
  }

  function deleteUser(index) {
    emailjs
      .send(
        "service_miw9zp4",
        "template_bjyfjbd",
        {
          from_name: "TDC - Cao đẳng Công nghệ Thủ Đức",
          to_name: users[index]?.name ?? "Unknown",
          message:
            "Tải khoản " +
            users[index]?.name +
            " - " +
            users[index]?.mssv +
            " hiện không thể hoạt động tại TFT",
          reply_to: users[index]?.mssv + "@mail.tdc.edu.vn",
        },
        "nbxhmGhQt4JpgZSUa"
      )
      .then(() => {
        toast.current.show({
          severity: "sucsess",
          summary: "Reply to contact",
          detail: "Reply successfully",
          life: 3000,
        });
      });

    const url = `${apiURL}users/${users[index].id}`;
    fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(() => {
        getFromDatabase();
      })
      .catch((err) => {
        console.log("remove user", err);
      });
  }

  return (
    <AdminLayout
      activeIndex={1}
      slot={
        <div className="admin-user-index">
          <Toast ref={toast} />
          <AdminSubPage
            title="ADMINISTRATION - USERS"
            columnTitles={[
              "STUDENT ID",
              "NAME",
              "COURSE",
              "CLASS",
              "JOINT AT",
              "RECENT UPDATE",
            ]}
            list={users}
            columns={["mssv", "name", "", "class", "created_at", "updated_at"]}
            total={total}
            handleRefresh={getFromDatabase}
            handlePagination={setPage}
            handleDelete={deleteUser}
          />

        </div>
      }
    />
  );
}
