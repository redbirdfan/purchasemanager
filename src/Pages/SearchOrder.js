import React from "react";
import {useState, useEffect} from "react";
import PageHeader from "../Components/PageHeader";

function SearchOrder() {

    const [orderno, setOrderno] = useState("")
    const [username, setUsername] = useState("")
    const [orderDate, setDate] = useState(""); 
    const [vendor, setVendor] = useState("");
    const [received, setReceived] = useState(null)
    const [partno, setPartno] = useState('')
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
            console.log("SearchOrder before adding: ", searchOrders)    

            if(orderno){
                searchOrders.append("orderno", orderno)
            }
            
            if(vendor){
                searchOrders.append("vendor", vendor)
            }

            if(partno){
                searchOrders.append("partno", partno)
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
            
    

function formatDate(dateString) {
    if (!dateString) return ''; 
  
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${month}/${day}/${year}`;
  }

    return (
            <>
            {loading === false && <p>{"User: " + firstName + " " + lastName}</p>}
            <header><PageHeader /></header>
            <input 
                type = "text" 
                placeholder ="Order Number"
                value = { orderno }
                onChange={(e) => setOrderno(e.target.value)}
            />
            
            <button onClick={findOrder}>Find Order</button>

            <div>
            {data && data.data.length > 0 && data.data.map((orders, index) => (
                <div key = {index} style={{display: 'flex', alignItems: 'center', borderBottom: '2px solid black', paddingBottom: '5px'}}>
                    <p style={{marginRight: '80px', marginLeft: '10px'}}>{orders?.vendor}</p>
                    <p style={{marginRight: '80px', marginLeft: '10px'}}>{orders?.partno}</p>
                    <p style={{marginRight: '80px', marginLeft: '10px'}}>{orders?.partdesc}</p> 
                    <p style={{marginRight: '80px', marginLeft: '10px'}}>{orders?.cost}</p>
                    <p style={{marginRight: '80px', marginLeft: "10px"}}>{orders?.quantity}</p>
                    <p style={{marginLeft: '10px'}}>{orders?.total}</p>
            </div>
            ))}
            </div>
        </>
    
        )
}

export default SearchOrder;
