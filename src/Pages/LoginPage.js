import React from "react";
import {useState} from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';



function LoginPage() {
 
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
 
    const navigate = useNavigate();

    const checkUser = async (e) => {
            e.preventDefault();
            setErr("");

            if(!username || !password) {
                setErr("Username and Password required");
                console.log("no username or password");
                return;
            } else {
                try {
                        const response = await fetch("/loginPage", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ username, password }),
                        });

                        const data = await response.json();   

                if (response.ok){
                    const token = data.token;
                    Cookies.set('authToken', token, { path: '/', httpOnly: true, expires: 2 });
                    navigate('/hub')
                    console.log("backend connection successful")
                    console.log(data)
                } else {
                    setErr("No response")
                    console.log(err);  
                } 

            }   catch (err) {
                console.log("ERROR", err);
                }
            }    
    }    


        return(
        <>
        <div style={{display: 'flex', flexDirection:'column', alignItems: 'center'}}>
            <header>Welcome to Purchase Manager</header>
                <h1>Please login below</h1>

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