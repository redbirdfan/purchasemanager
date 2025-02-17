import React from 'react'
import { Link } from 'react-router-dom'

function PageHeader(){

    return(
        <>
        <Link to={"/NewOrder"}>New Order</Link>
        <Link to={"/PartDataBase"}>Find a Part#</Link>
        <Link to={"/SearchOrder"}>Find Order</Link>
        </>
    )

}

export default PageHeader;