import React from 'react'
import { useContext } from 'react';
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext';
function PageHeader(){
    const { firstName, lastName, clearUser } = useContext(UserContext);
    async function logout(){
           
              try {
                const response = await fetch("/logout");
                if (response.ok) {
                  console.log("Auth token cleared.");
                } else {
                  console.error("Failed to clear auth token.");
                }
              } catch (error) {
                console.error("Error clearing auth token:", error);
              }
            };
        
            

    return(
        <> 
        <div>
          {firstName && lastName && <p>{firstName}{lastName}</p>}
        </div>
        <div style={{display: "flex", justifyContent:"center"}}>
        <Link to={"/NewOrder"} style={{marginRight: "50px"}}>New Order</Link>
        <Link to={"/PartDataBase"} style={{marginRight: "30px", marginLeft: "30px"}}>Find a Part#</Link>
        <Link to={"/SearchOrder"} style={{marginRight: "30px", marginLeft: "30px"}}>Find Order</Link>
        <Link to={"/Vendors"} style={{marginRight: "30px", marginLeft: "30px"}}>Vendors</Link>
        <Link to={"/Receiving"} style={{marginRight: "30px", marginLeft: "30px"}}>Receiving</Link>
        <Link to={"/loginPage"} style={{marginRight: "30px"}} onClick={logout}>LogOut</Link>
        </div>
        </>
    )

}

export default PageHeader