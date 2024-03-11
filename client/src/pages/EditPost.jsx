import { useEffect, useState } from "react";
import Editor from "../Editor";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import ClockLoader from "react-spinners/ClockLoader";

export default function EditPost() {



    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [files, setFiles] = useState(null)
    const [redirect , setRedirect] = useState(false)
    const [loading , setLoading] = useState(false)

    const {id} = useParams()

    //loader styling
    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
    };

    useEffect(()=>{
        setLoading(prev => true)
        fetch(`/api/post/${id}`)
        .then(response => response.json())
        .then(postInfo => {
            setLoading(prev => false)
            setTitle(prev => postInfo.title)
            setContent(prev => postInfo.content)
            setSummary(prev => postInfo.summary)
        })
        .catch(error => console.log(error))
    } , [])

    async function updatePost(ev) {
        ev.preventDefault()

        const data = new FormData()
        data.set('title' , title);
        data.set('summary' , summary)
        data.set('content' , content)
        data.set('file' , files?.[0])
        data.set('id' , id)//send id of the post

        //If there are files, only then access the value, 
        // other-wise error
        // console.log(files);
        // console.log(data);
        setLoading(prev => true)
        await fetch('/api/post' , {
            method:'PUT',
            body:data,
            credentials : 'include',
            //send the token, server will verify id of token
            //and the id of author which is in post.
        })
        setLoading((prev) => false)
        setRedirect((prev) => true)
    }

    if(redirect){
        return (
            <Navigate to ={"/post/" + id}/>
        )
    }
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
        <form onSubmit={updatePost}>
            <input
                type="title"
                placeholder="Title"
                value={title}
                onChange={ev => setTitle(ev.target.value)}
                required
            />
            <input
                type="summary"
                placeholder="Summary"
                value={summary}
                onChange={ev => setSummary(ev.target.value)}
                required
            />
            {/* Taking files as input. */}
            <label htmlFor="f">Only choose if you want to change</label>
            <input
                id="f"
                type="file"
                onChange={ev => setFiles(ev.target.files)}
                // required
            />

            <Editor value={content} onChange={setContent}/>
            <button style={{ marginTop: '15px' }}>Update Post</button>

        </form>
    );
}