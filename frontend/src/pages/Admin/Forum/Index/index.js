import { useEffect, useState } from "react";
import AdminLayout from "../../../../layouts/AdminLayout";
import AdminSubPage from "../../../../subpages/Admin";
import { apiURL } from "../../../../App";


export default function AdminForumIndex() {
    //states
    const [posts, setPosts] = useState([]);

    //effects
    useEffect(() => {
        getPostsFromDatabase();
    },[]);

    //handlers
    function getPostsFromDatabase() {
        const api = apiURL + "posts/forum";
        fetch(api)
        .then(res => res.json())
        .then(posts => {
            setPosts(posts)
        })
        .catch(err => {
            console.log("fetch posts in forum: ", err);
        })
    }


    return (
        <AdminLayout activeIndex={3} slot={
           <AdminSubPage
            title="ADMINISOLATION - THREATS IN FORUM"
            columnTitles={["TITLE", "CREATED AT"]}
            columns={["title", "created_at"]}
            list={posts}
            isAbleToAdd={false}
           />
        } />
    )
}