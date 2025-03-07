import React from "react";
import {useState} from "react";
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

            const response = await fetch(`http://localhost:5000/parts?${searchFields}`, {
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
                                const response = await fetch("http://localhost:5000/parts", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ vendor, partNo, partDesc, cost }),
                                });
            
                                
            
                        if (response.ok){
                            
                            const data = await response.json();
                            console.log("New Part:" + data)
            
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
                <div key = {index}>
                    <p>{parts?.vendor}</p>
                    <p>{parts?.partno}</p> 
                    <p>{parts?.partdesc}</p>
                    <p>{parts?.cost}</p>
                 </div>
            ))}
            </div>
        </>
    )
       }
    


export default PartDataBase;