import React from 'react';
import { useState } from 'react';
import PageHeader from "../Components/PageHeader";

function Receiving() {

    const [err, setErr] =useState('');
    const [orderno, setOrderno] = useState(''); 
    const [data, setData] = useState(null)

    const pullOrder = async (e) => {
            e.preventDefault();
            setErr("");
            console.log("Receiving Order number: ", orderno)            
            try {
                console.log("Pulling order to receive")
                console.log("SearchOrder before adding: ", orderno)
    
                const response = await fetch(`/orders?orderno=${orderno}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                    console.log("Calling for get orders", orderno)
    
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


    return(
        <>
            <div>
                <PageHeader />  
                <h1>Receiving order</h1>
                <form>
                <input  type =  'input'
                        placeholder='PO Number' 
                        value = { orderno }
                        onChange={(e) => setOrderno(e.target.value)}
            
                />
                <button onClick={pullOrder}>Find Order</button>
                </form>
           </div>
        </>
    )
}

export default Receiving;