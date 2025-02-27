import React from "react";
import { useNavigate } from "react-router-dom";
import { PencilIcon, NewspaperIcon, CogIcon, BookmarkSquareIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'

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

    function goToVendors(){
        navigate('/Vendors')
    }

    function gotToReceiving(){
        navigate('/Receiving')
    }

    return(
        <>
        <h1>Select your search</h1>
            
            <button onClick={startOrder} className="flex items-center">
                <NewspaperIcon className="h-5 w-5 mr-2" />
                New Order
                </button>
            
            <button onClick={findOrder} className="flex items-center">
                <PencilIcon className="h-5 w-5 mr-2" />
                Create an Order
                </button>
            
            <button onClick={goToPartDataBase} className="flex items-center">
                <CogIcon className="h-5 w-5 mr-2" />
                Find a part
                </button>
            
            <button onClick={goToVendors} className="flex items-center">
                <BookmarkSquareIcon className="h-5 w-5 mr-2" />        
                Vendors
                </button>
            
            <button onClick={gotToReceiving} className="flex items-center">
                <ClipboardDocumentCheckIcon className="h-5 w-5 mr-2/" />
                Receiving
                </button>
        </>
    )
}

export default Hub;