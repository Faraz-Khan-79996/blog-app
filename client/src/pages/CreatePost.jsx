import { useState } from 'react';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Navigate } from 'react-router-dom';

export default function CreatePost() {

    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [files, setFiles] = useState('')
    const [redirect , setRedirect] = useState(false)

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ]
    }

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

    async function createNewPost(event) {
        event.preventDefault()

        const data = new FormData()
        data.set('title' , title);
        data.set('summary' , summary)
        data.set('content' , content)
        data.set('file' , files[0])

        //console.log(files);//array
        const response = await fetch('/api/post', {
            method: 'POST',
            // body: JSON.stringify({ })
            body:data,
            credentials : 'include'
            //sending the cookies.
        })

        if(response.ok){
            setRedirect(true)
        }
    }
    if(redirect){
        return (
            <Navigate to ="/"/>
        )
    }
    return (
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

            <ReactQuill
                value={content}
                modules={modules}
                onChange={newValue => setContent(newValue)}
            //se the docs of react-quill
            // formats={formats}
            />
            <button style={{ marginTop: '15px' }}>Create Post</button>

        </form>
    );
}