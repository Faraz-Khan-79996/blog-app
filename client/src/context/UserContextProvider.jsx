import { useState } from "react";
import UserContext from "./UserContext";

const UserContextProvider = ({children})=>{

    const [userInfo , setUserInfo] = useState(null)
    
    
    // {
    //     iat:Number,
    //     id:String,
    //     username:String,
    // }
    // Received from backend '/api/login' and '/api/profile'

    return (
        <UserContext.Provider value={{userInfo , setUserInfo}}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;