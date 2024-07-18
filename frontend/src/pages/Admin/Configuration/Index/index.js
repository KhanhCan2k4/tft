import { useEffect, useRef, useState } from "react";
import AdminLayout from "../../../../layouts/AdminLayout";
import { apiURL, getDate } from "../../../../App";
import { Toast } from "primereact/toast";
import { Card, Popconfirm } from "antd";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Badge } from "react-bootstrap";

export default function AdminConfigIndex() {
  //refs
  const toast = useRef();
  //states
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [configs, setConfigs] = useState([]);

  //handlers
  const getConfigs = () => {
    const api = apiURL + "configs/pagination/" + page;

    fetch(api)
      .then((res) => res.json())
      .then((data) => {
        setConfigs(data.configs);
        setTotal(data.total);
      })
      .catch((err) => {
        console.log("fetch all configs failed", err);
      });
  };

  const handleSaveChanges = (config) => {
    const api = apiURL + "configs/" + config.key;

    fetch(api, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(config),
    })
      .then((res) => res.json())
      .then((data) => {
        switch (data.status) {
          case 200:
            toast.current.show({
              severity: "success",
              summary: "Update config",
              detail: "Update config successfully",
              life: 3000,
            });

            if (config.key === "AD_PASS") {
              window.location.reload();
            }
            break;
          default:
            toast.current.show({
              severity: "error",
              summary: "Update config",
              detail: "Update config unsuccessfully",
              life: 3000,
            });
            break;
        }
      })
      .catch((err) => {
        console.log("update config failed", err);
        toast.current.show({
          severity: "error",
          summary: "Update config",
          detail: "Update config unsuccessfully",
          life: 3000,
        });
      })
      .finally(() => {
        getConfigs();
      });
  };

  //effects

  //set title
  useEffect(() => {
    document.title = "Administration Configurations";
  }, []);

  //ferch all configs
  useEffect(() => {
    getConfigs();
  }, [page]);

  return (
    <AdminLayout
      activeIndex={6}
      slot={
        <div className="admin-index">
          <Toast ref={toast} />
          <h1>ADMINISTRATION - CONFIGURATIONS</h1>

          <Badge bg="danger" pill>
            {"APP'S CONFIGS"}
          </Badge>
          <Card className="list">
            <Pagination
              className="my-2"
              defaultPage={page}
              onChange={(e, page) => setPage(page)}
              count={Math.ceil(total / 5)}
              variant="outlined"
              color="error"
            />
            <Table stickyHeader className="bg-white">
              <TableHead>
                <TableRow>
                  <TableCell
                    align={"left"}
                    padding={"normal"}
                    sortDirection={"asc"}
                  >
                    <b>KEY</b>
                  </TableCell>

                  <TableCell
                    align={"left"}
                    padding={"normal"}
                    sortDirection={"asc"}
                  >
                    <b>VALUE</b>
                  </TableCell>

                  <TableCell
                    align={"left"}
                    padding={"normal"}
                    sortDirection={"asc"}
                  >
                    <b>CREATED AT</b>
                  </TableCell>

                  <TableCell
                    align={"left"}
                    padding={"normal"}
                    sortDirection={"asc"}
                  >
                    <b>UPDATED AT</b>
                  </TableCell>

                  <TableCell
                    align={"left"}
                    padding={"normal"}
                    sortDirection={"asc"}
                  >
                    <b>{"ACTIONS"}</b>
                    <button onClick={getConfigs} className="btn mx-2">
                      <i className="bi bi-arrow-clockwise"></i>
                    </button>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody key={new Date()}>
                {configs &&
                  configs.map((config, index) => (
                    <TableRow key={index}>
                      <TableCell>{config && config.key}</TableCell>
                      <TableCell width={"500px"}>
                        <textarea
                          rows={3}
                          onChange={(e) => {
                            config.value = e.target.value;
                          }}
                          className="form-control"
                          defaultValue={config && config.value}
                        ></textarea>
                      </TableCell>
                      <TableCell>
                        {config &&
                          config.created_at &&
                          getDate(config.created_at)}
                      </TableCell>
                      <TableCell>
                        {config &&
                          config.updated_at &&
                          getDate(config.updated_at)}
                      </TableCell>
                      <TableCell>
                        <Popconfirm
                          title="Update item"
                          description="Are you sure you want to update changes for this one?"
                          onConfirm={() => handleSaveChanges(config)}
                          onCancel={() => {
                            getConfigs();
                          }}
                          okText="Update"
                          cancelText="Cancel"
                        >
                          <button className="mx-2 btn text-danger">
                            <i className="bi bi-check2-circle"></i>
                          </button>
                        </Popconfirm>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      }
    />
  );
}
