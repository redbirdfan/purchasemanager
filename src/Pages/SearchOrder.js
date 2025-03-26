import React from "react";
import {useState, useEffect} from "react";
import PageHeader from "../Components/PageHeader";

function SearchOrder() {

    const [orderNo, setOrderNo] = useState("")
    const [username, setUsername] = useState("")
    const [date, setDate] = useState(""); 
    const [vendor, setVendor] = useState("");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] =useState(true);
    const [err, setErr] =useState('');
    
        useEffect(() => {
            async function userProfile() {
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
                        setLoading(false);
                        setErr('none')
                    } else {
                        setErr("failed to find user")
                        setLoading(true)
                    }
                }catch(err) {
                    setErr("Network Error")
                    setLoading(true)
                }
                }
                userProfile();
            }, []);
    

    function finderOrder(){
            //call to database to search for existing Orders
    }

    return (
            <>
            {loading === false && <p>{"User: " + firstName + " " + lastName}</p>}
            <header><PageHeader /></header>
            <input type = "text" placeholder ="Vendor"/>
 
        {/*will build out data to be shown with the order details, parts order, and items on order*/}
        </>

    )
    

}

export default SearchOrder;
