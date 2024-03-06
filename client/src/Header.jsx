import { useEffect, useState } from "react";
import { Link } from "react-router-dom";



export default function () {

    const [username, setUsername] = useState(null)

    //This is the header component.
    //call /profile to check if the token is valid.
    //if valid, set username.
    useEffect(() => {
        const getProfile = async () => {
            const response = await fetch('/api/profile', {
                credentials: 'include'
            })
            // console.log(response);
            const userInfo = await response.json();
            console.log(userInfo);
            if (response.ok) {
                setUsername(userInfo.username)
            }
        }
        getProfile()
    }, [])

    async function logout(){
        const response = fetch('/api/logout' , {
            method : 'POST',
        })
        setUsername(null)
    }

    return (
        <header>
            <Link to="/" className="logo">MyBlog</Link>
            <nav>

                {username && (
                    <>
                        <a>Hi @{username}!</a>
                        <Link to="/create">Create new</Link>
                        <a onClick={logout}>Logout</a>
                    </>
                )}


                {!username && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}


            </nav>
        </header>
    );
}