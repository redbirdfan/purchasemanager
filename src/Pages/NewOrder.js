import React from "react";
import { useNavigate } from "react-router-dom";
import {useState, useEffect} from "react"
import PageHeader from '../Components/PageHeader'
import Cookies from 'js-cookie'; 

function NewOrder(){

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
    

    const navigate=useNavigate();

    
    
    function addToOrder(){

    }

    function submitOrder(){

    }

    return(
        <>
        
        <header>Place your order...</header>
        <body>
        {loading === false && <p>{"User: " + firstName + " " + lastName}</p>}
            <header>
            <PageHeader />
            </header>
                <input type="text" placeholder="Vendor"/> {/*required to ensure part# can only be pulled from selected vendor*/}
                <input type="text" placeholder="Part#"/> {/*You can either type the part# in if known or scroll dropdown*/}
                <button onClick={addToOrder}>Add to order</button>
                
            {/*//Once selected information will be displayed in order as it is building.
        //Displayed parts will go here.*/}

        <button onClick={submitOrder}>Place Order</button>  {/*will add order to the database*/} 
        </body>
        </>
    )
}

export default NewOrder;