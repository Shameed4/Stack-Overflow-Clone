import { useEffect, useState } from "react";
import { renderUsers } from "../../request-functions/request-functions";

export default function AdminPage({signedInUser, setUserToView, setMode}) {
    const [allUsers, setAllUsers] = useState([])
    const [usersError, setUsersError] = useState(false);
    
    useEffect(() => {
        renderUsers(setAllUsers, setUsersError);
    }, [])

    function displayUsers() {
        if (usersError)
            return <h1>Error loading users</h1>
        if (allUsers.length == 0)
            return <h1>No users exist</h1>
        return ( 
            <ul>
                {allUsers.map(user => (
                <li key={user._id}>
                    <button onClick={() => {setUserToView(user); setMode(5);}}>{user.name}</button> 
                    <button onClick={() => console.log(user)}>Delete user</button>
                </li>
                ))}
            </ul>
        );
    }


    return (
        <div id="admin-page">
            <h1>Admin</h1>
            {displayUsers()}
        </div>
    )
}