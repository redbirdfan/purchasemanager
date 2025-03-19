import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PencilIcon, NewspaperIcon, CogIcon, BookmarkSquareIcon, ClipboardDocumentCheckIcon, XCircleIcon } from '@heroicons/react/24/outline'
import Cookies from 'js-cookie';
import { CircleStackIcon } from "@heroicons/react/24/outline";

function Hub() {
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [loading, setLoading] =useState(true);
    const [err, setErr] =useState('');

    useEffect(() => {
        async function userProfile() {
            try {
            const token = Cookies.get("authToken")
            if(!token){
                setErr("No token found")
                console.log(err)
                setLoading(true)
                return;
            }
                const response =await fetch('/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setFirstName(data.user.FirstName)
                    setLastName(data.user.LastName)
                    console.log(data.FirstName, data.LastName)
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
    return(
        <>
            {loading === false && <p>{firstName + " " + lastName}</p>}
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