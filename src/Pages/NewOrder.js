import React from "react";
import { useNavigate } from "react-router-dom";
import {useState, useEffect} from "react"
import PageHeader from '../Components/PageHeader'
import Cookies from 'js-cookie'; 

function NewOrder(){

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [vendorList, setVendorList] = useState([]);
    const [vendor, setVendor] =useState('');
    const [partsList, setPartsList] = useState([]);
    const [partno, setPartno] = useState();
    const [loading, setLoading] =useState(true);
    const [err, setErr] =useState('');


    useEffect(() => {
        async function fetchData() {
          try {
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
        
            if (vendorResponse.ok) {
              const vendorData = await vendorResponse.json();

              const sortedVendorData = [...vendorData].sort((a, b) => {
                const nameA = a.vending.toUpperCase();
                const nameB = b.vending.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0; 
            });
              setVendorList(sortedVendorData);
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

       

    
        const handleVendorChange = (event) => {
            console.log("Vendor handler is being called")
            event.stopPropagation()
            const selectedVendor = event.target.value;
            setVendor(selectedVendor);
            console.log("handleVendorChange selected vendor is: ", selectedVendor);

            if (selectedVendor) {
              console.log("Launching fetchparts for selectedVendor existing")
              try {
                  const fetchParts = fetch("/partsList", { 
                      headers: {
                          credentials: "include",
                      },
                  });
  
                  if (fetchParts.ok) {
                      const partsData = fetchParts.json(); 
                      const sortedPartsData = [...partsData].sort((a, b) => {
                          if (a.partno < b.partno) { 
                              return -1;
                          }
                          if (a.partno > b.partno) {
                              return 1;
                          }
                          return 0;
                      });
                      console.log(sortedPartsData)
                      setPartsList(sortedPartsData);
                  } else {
                      console.error("Failed to fetch parts");
                      setPartsList([]);
                  }
              } catch (error) {
                  console.error("Error fetching parts:", error);
                  setPartsList([]);
              }
          } else {
            setPartsList([]);
          }
      };
        

    const handlePartnoChange = (event) =>{
      setPartno(event.target.value);
      console.log("Selected partno: ", event.target.value);
    }

    
    function addToOrder(){

    }

    function submitOrder(){

    }

    return(
        <>
        
        <header>Place your order...</header>
        <div>
        {loading === false && <p>{"User: " + firstName + " " + lastName}</p>}
            <header>
            <PageHeader />
            <br></br>
            </header>
                <select id="vendor" style={{ width: '200px' }} onChange={ handleVendorChange } value={ vendor }>
                <option value="">Select a Vendor</option>
                    {vendorList.map((vendor) => (
                        <option key={vendor.vending} value = {vendor.vending}>
                            {vendor.vending}
                        </option>
                    ))}
                </select>
              
                
                <select id="partno" style={{width: '200px'}} onChange={ handlePartnoChange } value={ partno }>
                <option value="">Part #</option>
                    {partsList.map((parts) => (
                        <option key={parts.partno} value = {parts.partno}>
                            {parts.partno}
                        </option>
                    ))}
                </select>
                    
                <button onClick={addToOrder}>Add to order</button>
             
        <button onClick={submitOrder}>Place Order</button>  {/*will add order to the database*/} 
        </div>
        </>
    )
}

export default NewOrder;