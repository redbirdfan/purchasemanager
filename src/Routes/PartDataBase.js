import React from "react";
import useState from "useState";

function PartDataBase() {
    //create object variable to hold part# requirements. 
    //useState for array to be able to add the new part to the database
    //keys for object - Vendor, partNo, partDesc., cost 

    return (
        <header>Parts</header>
            <p>What are we looking for today?</p>
            <input type={{dropdown}}>Vendor</input> //dropbox listing all vendors available
            <input type={{dropdown}}>Description</input> //available to pull all descriptions, using contains or DB to scroll
            <input type={{dropdown}}>Part#</input> //typing in will allow contain to pull number typed or DB to scroll
            
            //When selecting on from any dropdown should display data in a grid row.
            //perhaps add a photo of the part down the line to display when part is selected

    )
}