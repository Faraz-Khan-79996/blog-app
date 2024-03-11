import { useEffect, useState } from "react";
import ClockLoader from "react-spinners/ClockLoader";
import Post from "../Post";

export default function IndexPage() {

    const [posts , setPosts] = useState([])
    const [loading , setLoading] = useState(false)

    //loader styling
    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
    };

    useEffect(()=>{
        setLoading(prev => true)
        fetch('/api/post')
        .then(response =>{
            return response.json()
        })
        .then(posts =>{
            setLoading(prev => false)
            // console.log(posts);
            //array of posts
            setPosts(posts)
        })
    } , [])

    // console.log(posts);

    if(loading){
        return (
            <div style={{
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                width:"100%",
                height:"500px",
            }}>
                {loading && (<div>
                    <ClockLoader
                        color={"silver"}
                        loading={loading}
                        cssOverride={override}
                        size={150}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>)}
            </div>
        )
    }

    return (
        <>
        {posts.length >0 && posts.map((post)=>(
            <Post {...post} key={post._id}/>
        ))}
        </>
    ); 
}