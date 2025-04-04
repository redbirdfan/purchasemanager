import React from "react";
import {useState, useEffect} from "react";
import PageHeader from "../Components/PageHeader";
import "./InputBox.css"

function PartDataBase() {
    
    const [vendor, setVendor] = useState("");
    const [partNo, setPartNo] = useState("")
    const [partDesc, setPartDesc] = useState("");
    const [cost, setCost] = useState("");
    const [err, setErr] = useState("")
    const [data, setData] = useState("")
    const [searchComplete, setSearchComplete] = useState(false)
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] =useState(true);

         useEffect(() => {
                console.log("NO UseEffect called")
                async function userProfile() {
                    console.log("NO userProfile running")
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
        
    
    function clearSearch(){
        setVendor('');
        setPartNo('');
        setPartDesc('')
        setCost('')
        setErr('')
        setData('')
        setSearchComplete(false)
        console.log("data and fields wiped")
        console.log('vendor:' +vendor)

    }

    const findPart = async (e) => {
        e.preventDefault();
        setErr("")
        setSearchComplete(true)
        try {

            const searchFields = new URLSearchParams()

            if(vendor){
                searchFields.append("vendor", vendor)
            }

            if(partNo){
                searchFields.append("partno", partNo)
            }
            
            if(partDesc){
                searchFields.append("partdesc", partDesc)
            }

            if(cost){
                searchFields.append("cost", cost)
            }

            const response = await fetch(`/parts?${searchFields}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
           
            const responseData = await response.json()
            setData(responseData)

            if (response.ok){
                    console.log("backend connection successful")
                    console.log(responseData)
                } else {
                    setErr("No response")
                    console.log(err);
                    setData(null)  
                }   

            }   catch (err) {
                console.log("ERROR", err);
                }
            }

        const newPart = async (e) => {
            e.preventDefault();
            setErr("");

            if(!vendor || !partNo || !partDesc || !cost) {
                        setErr("Required field missing");
                        console.log("Required field missing");
                        return;
                    } else {
                        try {
                                console.log("trying to post")
                                const response = await fetch("/parts", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ vendor, partNo, partDesc, cost }),
                                });
            
                        console.log(response)                    
            
                        if (response.ok){
                            const data = await response.json();

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
        {loading === false && <p>{"User: " + firstName + " " + lastName}</p>}
        <header><PageHeader /></header>
            <h1>What are we looking for today?</h1>

            <input 
                type="text"                
                className="buttonpadding" 
                placeholder="vendor" 
                value= { vendor }
                onChange={(e) => setVendor(e.target.value)}
            /> 
            
            <input 
                type="text" 
                className="buttonpadding" 
                placeholder="part#" 
                value={ partNo }
                onChange={(e) => setPartNo(e.target.value)}
            />

            <input 
                type="text" 
                className="buttonpadding" 
                placeholder="Item Description" 
                value= { partDesc }
                onChange={(e) => setPartDesc(e.target.value)}
            /> 
            
            <input 
                type="number" 
                className="buttonpadding" 
                placeholder="cost" 
                value= { cost }
                onChange={(e) => setCost(e.target.value)}
            />
            
            <br></br>
            
            <button onClick={findPart}>Find Part</button>
            <button onClick={newPart}>Add Part</button>
            <button onClick={clearSearch}>Clear Search</button>
            <div>
            {data && data.data.length > 0 && searchComplete && data.data.map((parts, index) => (
                <div key = {index} style={{display: 'flex', alignItems: 'center', borderBottom: '2px solid black', paddingBottom: '5px'}}>
                    <p style={{marginRight: '80px', marginLeft: '10px'}}>{parts?.vendor}</p>
                    <p style={{marginRight: '80px', marginLeft: '10px'}}>{parts?.partno}</p> 
                    <p style={{marginRight: '80px', marginLeft: '10px'}}>{parts?.partdesc}</p>
                    <p style={{marginLeft: '10px'}}>{parts?.cost}</p>
                 </div>
            ))}
            </div>
        </>
    )
       }
    


export default PartDataBase;