import React from "react";
import {useState, useEffect} from "react";
import PageHeader from "../Components/PageHeader";

function SearchOrder() {

    const [orderNumber, setOrderNumber] = useState("")
    const [username, setUsername] = useState("")
    const [orderDate, setDate] = useState(""); 
    const [vendor, setVendor] = useState("");
    const [received, setReceived] = useState("")

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
        console.log("Receiving status: " + received)
        try {
            const searchFields = new URLSearchParams()
            console.log("Receiving status: " + received)
            
            if(orderNumber){
                searchFields.append("ordernumber", orderNumber)
            }

            if(username){
                searchFields.append("username", username)
            }
            
            if(orderDate){
                searchFields.append("order_date", orderDate)
            }

            if(vendor){
                searchFields.append("vendor", vendor)
            }

            if(received) {
                searchFields.append("received", received)
            }

            const response = await fetch(`/orders?${searchFields}`, {
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
            {data && data.data.length > 0 && data.data.map((parts, index) => (
                <div key = {index} style={{display: 'flex', alignItems: 'center', borderBottom: '2px solid black', paddingBottom: '5px'}}>
                    <p style={{marginRight: '80px', marginLeft: '10px'}}>{parts?.username}</p>
                    <p style={{marginRight: '80px', marginLeft: '10px'}}>{parts?.orderNumber}</p> 
                    <p style={{marginRight: '80px', marginLeft: '10px'}}>{parts?.orderDate}</p>
                    <p style={{marginLeft: '10px'}}>{parts?.received}</p>
            </div>
            ))}
            </div>
        </>
    
        )
}

export default SearchOrder;
