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

    const findPArt = async (e) => {
        e.preventDefault();
        setErr("")

        try {

            const searchFields = new URLSearchParams({
                vendorname: vendor,
                partno: partNo,
                partdesc: partDesc,
                cost: cost
            })

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
        <header><PageHeader /></header>
            <h1>What are we looking for today?</h1>

            <input 
                type="text"                
                className="buttonpadding" 
                placeholder="Vendor" 
                value={vendor}
            /> 
            
            <input 
                type="text" 
                className="buttonpadding" 
                placeholder="Description" 
                value={partDesc}
                />{/*available to pull all descriptions, using contains or DB to scroll*/}
            
            <input 
                type="text" 
                className="buttonpadding" 
                placeholder="part#" 
                value={partNo}
            />{/*typing in will allow contain to pull number typed or DB to scroll*/}
            <input 
                type="number" 
                className="buttonpadding" 
                placeholder="cost" 
                value={cost}
            />
            
            <br></br>
            
            <button>Find Part</button>
            <button>Clear Search</button>
            {/*When selecting on from any dropdown should display data in a grid row.
            //perhaps add a photo of the part down the line to display when part is selected*/}
        </>
    )
}

export default PartDataBase;