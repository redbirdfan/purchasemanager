import React from "react";

function LoginPage() {
    function checkUser (username, password) {
    //create call to the database to check password and username 
    }

    return(
        <>
        <div>
            <header>Welcome to Purchase Manager</header>
                <h1>For all of your ordering needs!</h1>
                
                <input type ="text"/>
                <input type = "password"/>
                <button onClick="checkUser">Login</button>
        </div>
        </>
    );
};

export default LoginPage    