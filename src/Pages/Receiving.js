import React from 'react';
import {useState, useEffect} from 'react'
import PageHeader from "../Components/PageHeader";

function Receiving() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] =useState(true);
    const [err, setErr] =useState('');
    const [orderno, setOrderno] = useState(''); 
    const [searchOrder, setSearchOrder] = useState('');

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

    async function pullOrder() {
        
    }


    return(
        <>
            <div>
                {loading === false && <p>{"User: " + firstName + " " + lastName}</p>}
                <PageHeader />  
                <h1>Receiving order</h1>
                <input  text = "PO Number" 
                        placeholder='PO Number' 
                        value = { orderno }
            
                />
                
                <button onClick={pullOrder()}/>
           
           </div>
        </>
    )
}

export default Receiving;