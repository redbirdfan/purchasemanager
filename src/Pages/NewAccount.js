import React from "react";
import { useState } from 'react';

function NewAccount() {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [newUserName, setNewUserName] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');

    function createUser() {
        console.log("Tried to create account")
    }

    return (
        <>
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
            <button>Create Account</button>
            </>
        )
    }

export default NewAccount;