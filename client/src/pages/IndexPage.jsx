import { useEffect, useState } from "react";
import Post from "../Post";

export default function IndexPage() {

    const [posts , setPosts] = useState([])

    useEffect(()=>{
        fetch('/api/post')
        .then(response =>{
            return response.json()
        })
        .then(posts =>{
            // console.log(posts);
            //array of posts
            setPosts(posts)
        })
    } , [])

    console.log(posts);

    return (
        <>
        {posts.length >0 && posts.map((post)=>(
            <Post {...post} key={post._id}/>
        ))}
        </>
    ); 
}