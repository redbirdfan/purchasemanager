import React from "react";
import {useState} from "react";
import PageHeader from "../Components/PageHeader";
import "./InputBox.css"

function PartDataBase() {
    
    const [vendor, setVendor] = useState("");
    const [partNo, setPartNo] = useState("")
    const [partDesc, setPartDesc] = useState("");
    const [cost, setCost] = useState("");

    return (
        <>
        <header><PageHeader /></header>
            <p>What are we looking for today?</p>
            <input type="text" className="buttonpadding"  placeholder="Vendor"/> {/*dropbox listing all vendors available*/}
            <input className="buttonpadding" type="text" placeholder="Description"/>{/*available to pull all descriptions, using contains or DB to scroll*/}
            <input className="buttonpadding" type="text" placeholder="part#"/>{/*typing in will allow contain to pull number typed or DB to scroll*/}
            <br></br>
            <button>Find Part</button>
            <button>Clear Search</button>
            {/*When selecting on from any dropdown should display data in a grid row.
            //perhaps add a photo of the part down the line to display when part is selected*/}
        </>
    )
}

export default PartDataBase;