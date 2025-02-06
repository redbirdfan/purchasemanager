import React from "react";
import {useState} from "react";


function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    const checkUser = async (e) => {
            e.preventDefault();
            setErr("");

            if(username || password === "") {
                setErr("Username and Password required");
                return;
            }
                try {
                        const response = await fetch(" ", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({username, password}),
                        });

                if (response){
                    const data = await response.json();
                    console.log("Database connection good")
                } else {
                    const errorData = await response.json();
                    setErr(errorData)
                    console.log("Password or User does not match")
                } 
            }   catch (err) {
                setErr("Database not responding to request")
                console.log(err);
                }
            };    
        return(
        <>
        <div>
            <header>Welcome to Purchase Manager</header>
                <h1>For all of your ordering needs!</h1>
                
                <input 
                    type ="text"
                    placeholder = "Username"
                    value = {username}
                    onChange = {(e) => setUsername(e.target.value)}/>

                <input 
                    type = "password"
                    placeholder = "Password"
                    value = {password}
                    onChange = {(e) => setPassword(e.target.value)}/>

                <button onClick= {checkUser}>Login</button>
        </div>
        </>
    );
};


export default LoginPage