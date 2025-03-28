import React from "react";
import {useState, useEffect} from "react";
import PageHeader from "../Components/PageHeader";

function SearchOrder() {

    const [orderNumber, setOrderNumber] = useState("")
    const [username, setUsername] = useState("")
    const [orderDate, setDate] = useState(""); 
    const [vendor, setVendor] = useState("");
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] =useState(true);
    const [err, setErr] = useState('');

    const [data, setData] = useState();


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
    

    const findOrder = async (e) => {
        e.preventDefault();
        setErr("")

        try {
            console.log("CAlling findOrder")
            const searchOrders = new URLSearchParams()
            
            if(orderNumber){
                searchOrders.append("ordernumber", orderNumber)
            }

            if(username){
                searchOrders.append("username", username)
            }
            
            if(orderDate){
                searchOrders.append("order_date", orderDate)
            }

            if(vendor){
                searchOrders.append("vendor", vendor)
            }

            console.log("Looking for: ", searchOrders)

            const response = await fetch(`/orders?${searchOrders}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
                console.log("Calling for get orders")

            const responseData = await response.json()
            setData(responseData)
            console.log("Response Date", responseData)
            if (response.ok){
                    console.log("backend connection successful")
                    console.log(responseData)
                } else {
                    setErr("No response")
                    console.log(err);
                    setData(null)  
                }   

            }
            catch (err) {
            console.log("ERROR", err);
            }
        }
            

    return (
            <>
            {loading === false && <p>{"User: " + firstName + " " + lastName}</p>}
            <header><PageHeader /></header>
            <input 
                type = "text" 
                placeholder ="Order Number"
                value = { orderNumber }
                onChange={(e) => setOrderNumber(e.target.value)}
            />
            
            <button onClick={findOrder}>Find Order</button>

            <div>
            {data && data.data.length > 0 && data.data.map((order, index) => (
                <div key = {index} style={{display: 'flex', alignItems: 'center', borderBottom: '2px solid black', paddingBottom: '5px'}}>
                    <p style={{marginRight: '80px', marginLeft: '10px'}}>{order?.username}</p>
                    <p style={{marginRight: '80px', marginLeft: '10px'}}>{order?.orderNumber}</p> 
                    <p style={{marginRight: '80px', marginLeft: '10px'}}>{order?.orderDate}</p>
                    <p style={{marginLeft: '10px'}}>{order?.received}</p>
            </div>
            ))}
            </div>
        </>
    
        )
}

export default SearchOrder;
