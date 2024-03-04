
import { useState } from "react";

export default function RegisterPage() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    async function register(ev) {
        ev.preventDefault();
        console.log({ username, password });
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
        })
        // const obj = await response.json()
        // console.log(response);//This response is the complete object.
        // console.log(obj);//This object is the object sended by server. nothing else.

        if (response.status === 200) {
            alert('registration successful');
        } else {
            alert('Failed. User already registered.');
        }
    }

    return (
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                minlength="4"
            />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button>Register</button>
        </form>
    );
}