import React from "react";
import {useState} from "react";
import PageHeader from "../Components/PageHeader";


function Vendor(){
    const [vendor, setVendor] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [account, setAccount] = useState('')
    const [err, setErr] = useState('');

    const searchVendor = async (e) => {
        e.preventDefault();
        setErr("")

        try {

            const searchFields = new URLSearchParams({
                VendorName: vendor
            })

            const response = await fetch(`http://localhost:5000/vendor?${searchFields}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json()

            if (response.ok){
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
        <input  
            type = "text" 
            placeholder ="Vendor" 
            value={vendor}
            onChange={(e) => {setVendor(e.target.value)}}
        />
        
        <input 
            type = "text" 
            placeholder ="Address"
        />
        
        <input 
            type = "text" 
            placeholder ="Phone"
        />
        <input 
            type = "text"
            placeholder ="Account"
        />

        <button onClick={searchVendor}>Search</button>
        </>
    )

    }

export default Vendor;