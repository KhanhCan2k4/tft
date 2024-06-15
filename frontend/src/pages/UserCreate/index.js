import { useState } from "react";
import { apiURL } from "../../App";
import { json } from "react-router";

export default function UserCreate() {

    // const hiddenCourses = document.getElementById('#courses')
    // if (condition) {
    //     hiddenCourses.style.visibility = "hidden";
    // }
    // else{
    //     hiddenCourses.style.visibility = "visible";
    // }

    function processingEditUser() {
        console.log("clicked");
        fetch("http://localhost:8000/api/users", {
            method: "PATCH",
            body: JSON.stringify({
                name: "abcname",
                email: "abc"
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(
                console.log("s")
            )
            .catch(
                console.log("e")
            );

    }

    return <>
        <div className="container">
            <h1 className="py-5">Create User</h1>
            <form>
                <div className="form-group pb-3">
                    <label for="nameUser">Tên sinh viên</label>
                    <input type="text" className="form-control" id="nameUser" name="nameUser" value="" />
                </div>
                <div className="form-group pb-3">
                    <label for="exampleInputEmail1">Địa chỉ email</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" name="email" />
                </div>
                <div className="form-group pb-3">
                    <label for="position">Chức vụ</label><br />
                    <select className="form-select" name="position" id="position">
                        <option value="1">Sinh viên</option>
                        <option value="2">Trợ giảng</option>
                        <option value="3">Giảng viên</option>
                        <option value="4">Cố vấn học tập</option>
                    </select>
                </div>
                <div id="courses" className="form-group pb-3 courses">
                    <label for="courses">Khóa</label>
                    <input type="number" className="form-control" id="courses" name="courses" min={1} max={5} step={1} value="" readOnly/>
                </div>
                <button type="submit" className="btn btn-primary">Comfirm</button>
            </form>
        </div>
    </>;
}
