import React from "react";
import {useState} from "react";


function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    const checkUser = async (e) => {
            e.preventDefault();
            setErr("");

            if(!username || !password) {
                setErr("Username and Password required");
                console.log("no username or password");
                return;
            } else {
                try {
                        const response = await fetch("http://localhost:5000/LoginPage", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ username, password }),
                        });

                        const data = await response.json();

                if (response.ok){
                    console.log(data)
                } else {
                    setErr("No response")
                    console.log(err);  
                } 

            }   catch (err) {
                
                console.log("ERROR");
                }
            }    
    }    

        return(
        <>
        <div>
            <header>Welcome to Purchase Manager</header>
                <h1>Please login below.</h1>
                
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