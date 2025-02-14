import React from "react";
import { useNavigate } from "react-router-dom";

function Hub() {
    const navigate = useNavigate();

    function startOrder() {
        navigate('/NewOrder');
    }

    function findOrder() {
        navigate('/SearchOrder');
    }

    function goToPartDataBase(){
        navigate('/PartDataBase')
    }
    return(
        <>
        <h1>Select your search</h1>
            <button onClick={startOrder}>New Order</button>
            <button onClick={findOrder}>Create an Order</button>
            <button onClick={goToPartDataBase}>Find a part#</button>
        </>
    )
}

export default Hub;