import { useEffect, useState } from "react";
import Editor from "../Editor";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";

export default function EditPost() {



    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [files, setFiles] = useState(null)
    const [redirect , setRedirect] = useState(false)

    const {id} = useParams()

    useEffect(()=>{
        fetch(`/api/post/${id}`)
        .then(response => response.json())
        .then(postInfo => {
            setTitle(postInfo.title)
            setContent(postInfo.content)
            setSummary(postInfo.summary)
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
        await fetch('/api/post' , {
            method:'PUT',
            body:data,
            credentials : 'include',
            //send the token, server will verify id of token
            //and the id of author which is in post.
        })

        setRedirect(true)
    }

    if(redirect){
        return (
            <Navigate to ={"/post/" + id}/>
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