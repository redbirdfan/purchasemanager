import React from "react";
import {useState} from "react";
import PageHeader from "../Components/PageHeader";


function Vendor(){
    const [vendor, useVendor] = useState('');
    const [address, useAddress] = useState('');
    const [phone, usePhone] = useState('');
    const [account, useAccount] = useState('')
    const [err, setErr] = useState('');

    const searchVendor = async (e) => {
        e.preventDefault();
        setErr("")

        try {

            const searchFields = new URLSearchParams({
                vendor: vendor,
                address: address,
                phone: phone,
                account: account
            })

            const response = await fetch('http://localhost:5000/vendors?${searchFields}', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok){
                    const data = await response.json()
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

    return (
        <>
        <div>
            <PageHeader />
        </div>
        <input type = "text" placeholder ="Vendor"/>
        <input type = "text" placeholder ="Address"/>
        <input type = "text" placeholder ="Phone"/>
        <input type = "text" placeholder ="Account"/>

        <button onClick={searchVendor}>Search</button>
        </>
    )

    }

export default Vendor;