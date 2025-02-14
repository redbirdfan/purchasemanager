import React from "react";
import {useState} from "react";
import PageHeader from "../Components/PageHeader";

function SearchOrder() {

    const [orderNo, setOrderNo] = useState("")
    const [username, setUsername] = useState("")
    const [date, setDate] = useState(""); 
    const [vendor, setVendor] = useState("");

    function finderOrder(){
            //call to database to search for existing Orders
    }

    return (
            <>
            <header><PageHeader /></header>
            <input type = "text" placeholder ="Vendor"/>
 
        {/*will build out data to be shown with the order details, parts order, and items on order*/}
        </>

    )
    

}

export default SearchOrder;
