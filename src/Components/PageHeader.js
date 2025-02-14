import React from 'react'
import { useNavigate } from 'react-router-dom'

function PageHeader(){

    const navigate = useNavigate();

    function goToNewOrder(){
        navigate('/NewOrder');
    }

    function goToPartDataBase(){
        navigate('/PartDataBase')
    }

    function goToSearchOrder(){
        navigate('/SearchOrder')
    }

    return(
        <>
        <button onClick={goToNewOrder}>New Order</button>
        <button onClick={goToPartDataBase}>Find a Part#</button>
        <button onClick={goToSearchOrder}>Find Order</button>
        </>
    )

}

export default PageHeader;