import React from "react";
import useState from "react";

function SearchOrder() {

    const [orderNo, setOrderNo] = useState("")
    const [username, setUsername] = useState("")
    const [date, setDate] = useState(""); 
    const [vedor, setVendor] = useState("");

    function finderOrder(){
            //call to database to search for existing Orders
    }

    return (
            <>
            <input type = "text" placeholder ="Vendor"/>
 
        {/*will build out data to be shown with the order details, parts order, and items on order*/}
        </>

    )
    

}

export default SearchOrder;
