import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PencilIcon, NewspaperIcon, CogIcon, BookmarkSquareIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'

function Hub() {
    const [username, setUsername] = useState(null);
    const [loading, setLoading] =useState(true)
    const [err, setErr] =useState('')

    useEffect(() => {
        async function userProfile() {
            try {
                const response =await fetch('http://localhost:5000/profile');
                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.Username)
                    console.log(username)
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

    function gotToReceiving(){
        navigate('/Receiving')
    }

    return(
        <>
            {loading === false && <p>{username}</p>}
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
            
            <button onClick={gotToReceiving} style={{width: 150, height: 150}} className="flex items-center" >
                Receiving
                <ClipboardDocumentCheckIcon className="h-5 w-5 mr-2/" />
                </button>
            </div>
        </>
    )
}

export default Hub;