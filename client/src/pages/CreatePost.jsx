import { useState } from 'react';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function CreatePost() {

    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [files, setFiles] = useState('')

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
        fetch('/api/post', {
            method: 'POST',
            // body: JSON.stringify({ })
            body:data,
        })
    }

    return (
        <form onSubmit={createNewPost}>
            <input
                type="title"
                placeholder="Title"
                value={title}
                onChange={ev => setTitle(ev.target.value)}
            />
            <input
                type="summary"
                placeholder="Summary"
                value={summary}
                onChange={ev => setSummary(ev.target.value)}
            />
            {/* Taking files as input. */}
            <input
                type="file"
                onChange={ev => setFiles(ev.target.files)}
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