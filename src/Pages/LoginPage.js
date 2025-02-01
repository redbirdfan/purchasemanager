import React from "react";

function LoginPage(){
    function checkUser (username, password) {
    //create call to the database to check password and username 
    }

    return(
        <>
        <div>
            <header>Welcome to Purchase Manager</header>
                <p>For all of your ordering needs!</p>
                
                <input type ="text">Username</input>
                <input type = "password">Password</input>
                <button onClick="checkUser">Login</button>
        </div>
        </>
    )
}

export default LoginPage    