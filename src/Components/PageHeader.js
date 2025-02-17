import React from 'react'
import { Link } from 'react-router-dom'

function PageHeader(){

    return(
        <>
        <div style={{display: "flex", justifyContent:"center"}}>
        <Link to={"/NewOrder"} style={{marginRight: "50px"}}>New Order</Link>
        <Link to={"/PartDataBase"} style={{marginRight: "30px", marginLeft: "30px"}}>Find a Part#</Link>
        <Link to={"/SearchOrder"} style={{marginLeft: "30px"}}>Find Order</Link>
        </div>
        </>
    )

}

export default PageHeader;