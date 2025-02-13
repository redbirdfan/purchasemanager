import React from "react";
import { useState } from 'react';

function NewAccount() {
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
                placeholder="Choose a Username"
                value = {newUserName}
                onChange={(e) => {setNewUserName(e.target.value)}}/>

            <input 
                type = "password"
                placeholder = "password"
                value = {newUserPassword}
                onChange = {(e) => {setNewUserPassword(e.target.value)}}/>

            <input  
                type = "email"
                placeholder = "Email"
                value = {newUserEmail}
                onChange={(e) => {setNewUserEmail(e.target.value)}}/>

            <button>Create Account</button>
            </>
        )
    }

export default NewAccount;