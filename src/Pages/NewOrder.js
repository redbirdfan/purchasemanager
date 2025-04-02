import React from "react";
import { useNavigate } from "react-router-dom";
import {useState, useEffect} from "react"
import PageHeader from '../Components/PageHeader'
import Cookies from 'js-cookie'; 

function NewOrder(){

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [vendorList, setVendorList] = useState([]);
    const [loading, setLoading] =useState(true);
    const [err, setErr] =useState('');

    useEffect(() => {
        async function fetchData() {
          try {
            // Fetch user profile
            const profileResponse = await fetch('/profile', {
              headers: {
                credentials: 'include',
              },
            });
            console.log("fetch /profile: ", profileResponse);
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              setFirstName(profileData.user.FirstName);
              setLastName(profileData.user.LastName);
              console.log(profileData.FirstName, profileData.LastName);
            } else {
              setErr("failed to find user");
              setLoading(true);
              console.log("Set loading to: ", true);
            }
    
            
            const vendorResponse = await fetch('/vendorList', {
                headers:{
                    credentials: 'include',
                },
            });
            console.log("/vendorList: ", vendorResponse)
            if (vendorResponse.ok) {
                    console.log("VendorResponse OK")
              const vendorData = await vendorResponse.json();
                    console.log(vendorData)
              const foundVendors = vendorData.map(item => item['vending']);
                    console.log("Vendor List: ", foundVendors)
            } else {
              console.error("Failed to fetch vendors");
            }
    
            setLoading(false);
            console.log("Loading set to: ", false);
            setErr('none');
          } catch (error) {
            setErr("Network Error");
            setLoading(true);
            console.log("Loading set to: ", true);
            console.error("Error fetching data:", error);
          }
        }
    
        fetchData();
        console.log("fetchData function called");
      }, []);
    
    

    const navigate=useNavigate();

    const createVendorList = async (e) => {
        
    }

    
    
    function addToOrder(){

    }

    function submitOrder(){

    }

    return(
        <>
        
        <header>Place your order...</header>
        <body>
        {loading === false && <p>{"User: " + firstName + " " + lastName}</p>}
            <header>
            <PageHeader />
            </header>
                <label for = "vendor">Choose a Vendor</label>
                <select id="vendor">
                    {vendorList.map((vendor) => (
                        <option  key={vendor.vendor} value = {vendor.vendor}>
                            {vendor.vendor}
                        </option>
                    ))}
                </select>
                <input type="text" placeholder="Part#"/> {/*You can either type the part# in if known or scroll dropdown*/}
                <button onClick={addToOrder}>Add to order</button>
                
            {/*//Once selected information will be displayed in order as it is building.
        //Displayed parts will go here.*/}

        <button onClick={submitOrder}>Place Order</button>  {/*will add order to the database*/} 
        </body>
        </>
    )
}

export default NewOrder;