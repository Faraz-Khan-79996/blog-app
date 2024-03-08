import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "./context/UserContext";



export default function () {

    // const [username, setUsername] = useState(null)
    const {userInfo , setUserInfo} = useContext(UserContext)

    //This is the header component.
    //call /profile to check if the token is valid.
    //if valid, set username.
    useEffect(() => {
        const getProfile = async () => {
            const response = await fetch('/api/profile', {
                credentials: 'include'
            })
            // console.log(response);
            const userInfo_api = await response.json();
            // console.log(userInfo_api);
            if (response.ok) {
                // setUsername(userInfo.username)
                setUserInfo(userInfo_api)
            }
        }
        getProfile()
    }, [])

    async function logout(){
        const response = fetch('/api/logout' , {
            method : 'POST',
        })
        setUserInfo(null)
    }

    const username = userInfo?.username;

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