import { useState } from "react";
import {Navigate} from 'react-router-dom'

export default function LoginPage() {

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [redirect , setRedirect] = useState(false)

    async function login(ev) {
        ev.preventDefault();

        const response = await fetch('http://localhost:3000/api/login' , {
            method:'POST',
            body : JSON.stringify({username , password}),
            headers : {
                'Content-Type' : 'application/json'
            },
            credentials: 'include',
        })
        // console.log(response);
        if(response.ok){
            setRedirect(true)
        }
        else{
            const obj = await response.json()
            // console.log(obj);
            alert(obj.msg)
        }
    }

    if(redirect){
        return <Navigate to="/"/>
    }

    return (
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
            <input
                type="text"
                placeholder="username"
                minLength="4"
                value={username}
                onChange={ev => setUsername(ev.target.value)}
            />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={ev => setPassword(ev.target.value)}
            />
            <button>Login</button>
        </form>
    );
}

