import React from "react";
import {useState, useEffect} from "react";
import PageHeader from "../Components/PageHeader";


function Vendor(){
    const [vendor, setVendor] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [account, setAccount] = useState('')
    const [err,     setErr] = useState('');
    const [data, setData] =useState(null)
    const [searchComplete, setSearchComplete] = useState(false)
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] =useState(true);
        
        useEffect(() => {
            console.log("UseEffect called")
            async function userProfile() {
                console.log("userProfile running")
                try {
                    const response =await fetch('/profile', {
                        headers: {
                            credentials: 'include',
                        }
                    });
                    console.log("fetch /profile: ", response)
                    if (response.ok) {
                        const data = await response.json();
                        setFirstName(data.user.FirstName)
                        setLastName(data.user.LastName)
                        console.log(data.FirstName, data.LastName)
                        setLoading(false);
                        console.log("Loading set to: ", false)
                        setErr('none')
                    } else {
                        setErr("failed to find user")
                        setLoading(true)
                        console.log("Set loading to: ", true)
                    }
                }catch(err) {
                    setErr("Network Error")
                    setLoading(true)
                    console.log("Loading set to: ", true)
                }
                }
                userProfile();
                console.log("userProfile function called")
            }, []);
    

    const searchVendor = async (e) => {
        e.preventDefault();
        setErr("")
        setSearchComplete(true)
        try {

            const searchFields = new URLSearchParams()
                if(vendor){
                    searchFields.append("VendorName", vendor)
                }

                if(address){
                    searchFields.append("Address", address)
                }
                
                if(phone){
                    searchFields.append("phone", phone)
                }

                if(account){
                    searchFields.append("account", account)
                }
            

            const response = await fetch(`http://localhost:5000/vendor?${searchFields}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const responseData = await response.json()
            setData(responseData)

            if (response.ok){
                    console.log("backend connection successful")
                    console.log(data)
                } else {
                    setErr("No response")
                    console.log(err);  
                    setData(null)
                } 

            }   catch (err) {
                console.log("ERROR", err);
                }
          
        }

    return (
        <>
        <div>
            {loading === false && <p>{"User: " + firstName + " " + lastName}</p>}  
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
            value={address}
            onChange={(e) => {setAddress(e.target.value)}}
        />
        
        <input 
            type = "text" 
            placeholder ="Phone"
            value={phone}
            onChange={(e)=> {setPhone(e.target.value)}}
        />
        <input 
            type = "text"
            placeholder ="Account"
            value={account}
            onChange={(e) => {setAccount(e.target.value)}}
        />

        <button onClick={searchVendor}>Search</button>

        <div style={{display: "flex", flexWrap: "wrap"}}>
            {searchComplete && data && data.success && data.data.length > 0 && 
            data.data.map((vendor, index) => (
            <div key = {index} style={{display: "inline-block", marginRight: "20px", verticalAlign: "top"}}>
            <p>{vendor?.VendorName}</p>
            <p>{vendor?.Address}</p> 
            <p>{vendor?.phone}</p>
            <p>{vendor?.account}</p>
            </div>
            ))}      
        </div>
        </>
    )

    }

export default Vendor;