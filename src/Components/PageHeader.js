import React from 'react'
import { Link } from 'react-router-dom'
import { PencilIcon, NewspaperIcon, CogIcon, BookmarkSquareIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'


function PageHeader(){

    function logOut() {
                
    }

    return(
        <> 
        <div style={{display: "flex", justifyContent:"center"}}>
        <Link to={"/NewOrder"} style={{marginRight: "50px"}}>New Order</Link>
        <Link to={"/PartDataBase"} style={{marginRight: "30px", marginLeft: "30px"}}>Find a Part#</Link>
        <Link to={"/SearchOrder"} style={{marginRight: "30px", marginLeft: "30px"}}>Find Order</Link>
        <Link to={"/Vendors"} style={{marginRight: "30px", marginLeft: "30px"}}>Vendors</Link>
        <Link to={"/Receiving"} style={{marginRight: "30px", marginLeft: "30px"}}>Receiving</Link>
        <Link to={"/loginPage"} style={{marginRight: "30px"}}>LogOut</Link>
        </div>
        </>
    )

}

export default PageHeader