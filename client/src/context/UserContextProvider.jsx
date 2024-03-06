import UserContext from "./UserContext";

const UserContextProvider = ({children})=>{
    return (
        <UserContext.Provider value={{}}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;