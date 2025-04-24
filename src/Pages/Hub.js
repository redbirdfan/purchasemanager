import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PencilIcon, NewspaperIcon, CogIcon, BookmarkSquareIcon, ClipboardDocumentCheckIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { UserContext } from "../UserContext";


function Hub() {
    const user = useContext(UserContext)
    const [loading, setLoading] =useState(true);
    const [err, setErr] =useState('');
      

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

    function goToVendors(){
        navigate('/Vendors')
    }

    function goToReceiving(){
        navigate('/Receiving')
    }

    function gotToLoginPage(){
        navigate('/loginPage')
    }

    console.log("Loading state before render:" ,loading);
    console.log("User: ", user)
    return(
        <>            
        <p>User: {user.firstName} {user.lastName}</p>
        <div style={{display: "flex", alignItems: 'center',justifyContent: 'center'}}>
            <button onClick={startOrder} style={{width: 150, height: 150}} className="flex items-center">
                New Order
                <NewspaperIcon className="h-5 w-5 mr-2" />
                </button>
            
            <button onClick={findOrder} style={{width: 150, height: 150}} className="flex items-center">
                Search Order
                <PencilIcon className="h-5 w-5 mr-2" /> 
                </button>
            
            <button onClick={goToPartDataBase} style={{width: 150, height: 150}} className="flex items-center">
                Find a Part
                <CogIcon className="h-5 w-5 mr-2" />
                </button>
            
            <button onClick={goToVendors} style={{width: 150, height: 150}} className="flex items-center">
                Vendors
                <BookmarkSquareIcon className="h-5 w-5 mr-2" />        
                </button>
            
            <button onClick={goToReceiving} style={{width: 150, height: 150}} className="flex items-center" >
                Receiving
                <ClipboardDocumentCheckIcon className="h-5 w-5 mr-2/" />
                </button>

            <button onClick={gotToLoginPage} style={{width: 150, height: 150}} className="flex items-center" >
                Logout
                <XCircleIcon className="h-5 w-5 mr-2/" />
                </button>
                
            </div>
        </>
    )
}

export default Hub;