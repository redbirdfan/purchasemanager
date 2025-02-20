import React from "react";
import { useState } from 'react';

function NewAccount() {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [newUserName, setNewUserName] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [err, setErr] = useState('');

    const createUser = async (e) => {
        e.preventDefault();
        setErr("");

        if(!newUserName || !newUserPassword || !newUserEmail || !firstName || !lastName) {
            setErr("Required field missing");
            console.log("Required field missing");
            return;
        } else {
            try {
                    const response = await fetch("http://localhost:5000/NewAccount", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ newUserName, newUserPassword, newUserEmail, firstName, lastName }),
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

    return (
        <>
        <div style={{display: 'flex', flexDirection:'column', alignItems: 'center'}}>
        <h1>New Account page</h1>
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => {setFirstName(e.target.value)}}
            />
            <br></br>
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => {setLastName(e.target.value)}}
            />
            <br></br>
            <input
                type="text"
                placeholder="Choose a Username"
                value = {newUserName}
                onChange={(e) => {setNewUserName(e.target.value)}}
            />
            <br></br>
            <input 
                type = "password"
                placeholder = "password"
                value = {newUserPassword}
                onChange = {(e) => {setNewUserPassword(e.target.value)}}
            />
            <br></br>
            <input  
                type = "email"
                placeholder = "Email"
                value = {newUserEmail}
                onChange={(e) => {setNewUserEmail(e.target.value)}}
            />
            <br></br>
            <button onClick={createUser}>Create Account</button>
            </div>
            </>
        )
    }

export default NewAccount;