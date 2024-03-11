import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Editor from '../Editor';
import ClockLoader from "react-spinners/ClockLoader";

export default function CreatePost() {

    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [files, setFiles] = useState('')
    const [redirect, setRedirect] = useState(false)
    const [loading, setLoading] = useState(false);

    //loader styling
    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red",
    };

    async function createNewPost(event) {
        event.preventDefault()

        const data = new FormData()
        data.set('title', title);
        data.set('summary', summary)
        data.set('content', content)
        data.set('file', files[0])

        setLoading(true)
        //console.log(files);//array
        const response = await fetch('/api/post', {
            method: 'POST',
            // body: JSON.stringify({ })
            body: data,
            credentials: 'include'
            //sending the cookies.
        })
        setLoading(false)
        if (response.ok) {
            setRedirect(true)
        }
    }
    if (redirect) {
        return (
            <Navigate to="/" />
        )
    }
    if (loading) {
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
            <form onSubmit={createNewPost}>
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
                <input
                    type="file"
                    onChange={ev => setFiles(ev.target.files)}
                    required
                />

                <button style={{ marginTop: '15px' }}>Create Post</button>
                <Editor value={content} onChange={setContent} />
            </form>
        </>
    );
}