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
    

    function finderOrder(){
            //call to database to search for existing Orders
    }

    return (
            <>
            {loading === false && <p>{firstName + " " + lastName}</p>}
            <header><PageHeader /></header>
            <input type = "text" placeholder ="Vendor"/>
 
        {/*will build out data to be shown with the order details, parts order, and items on order*/}
        </>

    )
    

}

export default SearchOrder;
