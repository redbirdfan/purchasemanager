import React from "react";
import {useState} from "react";
import PageHeader from "../Components/PageHeader";

function PartDataBase() {
    //create object variable to hold part# requirements. 
    //useState for array to be able to add the new part to the database
    //keys for object - Vendor, partNo, partDesc., cost 
    const [vendor, setVendor] = useState("");
    const [partNo, setPartNo] = useState("")
    const [partDesc, setPartDesc] = useState("");
    const [cost, setCost] = useState("");

    return (
        <>
        <header><PageHeader /></header>
            <p>What are we looking for today?</p>
            <input type="text" placeholder="Vendor"/> {/*dropbox listing all vendors available*/}
            <input type="text" placeholder="Description"/>{/*available to pull all descriptions, using contains or DB to scroll*/}
            <input type="text" placeholder="part#"/>{/*typing in will allow contain to pull number typed or DB to scroll*/}
            
            {/*When selecting on from any dropdown should display data in a grid row.
            //perhaps add a photo of the part down the line to display when part is selected*/}
        </>
    )
}

export default PartDataBase;