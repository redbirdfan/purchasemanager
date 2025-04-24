import React from 'react';
import {useState, useEffect, useContext} from 'react'
import PageHeader from "../Components/PageHeader";

function Receiving() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] =useState(true);
    const [err, setErr] =useState('');
    const [orderno, setOrderno] = useState(''); 
    const [searchOrder, setSearchOrder] = useState('');

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