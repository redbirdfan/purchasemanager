import React from "react";
import {useState} from "react"

function NewOrder(){

    function addToOrder(){

    }

    function submitOrder(){

    }

    return(
    <header>Place your order...</header>
        <input type={{required}}>Vendor</input>  //required to ensure part# can only be pulled from selected vendor
        <input type={{dropdown}}>Part #</input> //You can either type the part# in if known or scroll dropdown
        <button onClick={{addToOrder}}>Add to order</button>
        //Once selected information will be displayed in order as it is building.
        //Displayed parts will go here.

        <button onClick={{submitOrder}}>Place Order</button>  //will add order to the database 

    )
}