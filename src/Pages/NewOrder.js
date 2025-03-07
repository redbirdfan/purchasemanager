import React from "react";
import { useNavigate } from "react-router-dom";
import {useState} from "react"
import PageHeader from '../Components/PageHeader'

function NewOrder(){

    const navigate=useNavigate();
    
    function addToOrder(){

    }

    function submitOrder(){

    }

    return(
        <>
        <header>Place your order...</header>
        <body>
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