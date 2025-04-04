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
                    
            } else {
              console.error("Failed to fetch vendors");
            }

            async function fetchParts(selectedVendor) {
              if (selectedVendor) {
                  try {
                      const partResponse = await fetch(`/partsList?vendor=${selectedVendor}`, { //Pass vendor as query parameter
                          headers: {
                              credentials: 'include',
                          },
                      });
      
                      if (partResponse.ok) {
                          const partData = await partResponse.json();
                          const sortedPartData = [...partData].sort((a, b) => {
                              const nameA = a.partnumber;
                              const nameB = b.partnumber;
                              if (nameA < nameB) {
                                  return -1;
                              }
                              if (nameA > nameB) {
                                  return 1;
                              }
                              return 0;
                          });
      
                          setPartsList(partData);
                          console.log(partsList);
                      } else {
                          console.error("Failed to fetch parts");
                      }
                  } catch (error) {
                      console.error("Error fetching parts:", error);
                  }
              }
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
        const selectedVendor = event.target.value;
        setVendor(selectedVendor);
        setPartsList([]); 
        console.log("Selected vendor is: ", selectedVendor);
        findParts(selectedVendor);
      };

      async function findParts(selectedVendor) {
        if (selectedVendor) {
            try {
                const partResponse = await fetch(`/partsList?vendor=${selectedVendor}`, { 
                    headers: {
                        credentials: 'include',
                    },
                });

                if (partResponse.ok) {
                    const partData = await partResponse.json();
                    const sortedPartData = [...partData].sort((a, b) => {
                        const nameA = a.partnumber;
                        const nameB = b.partnumber;
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                        return 0;
                    });

                    setPartsList(partData);
                    console.log(partsList);
                } else {
                    console.error("Failed to fetch parts");
                }
            } catch (error) {
                console.error("Error fetching parts:", error);
            }
        }
    }

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
        <body>
        {loading === false && <p>{"User: " + firstName + " " + lastName}</p>}
            <header>
            <PageHeader />
            <br></br>
            </header>
                <select id="vendor" style={{ width: '200px' }} onChange={{handleVendorChange}} value={vendor}>
                <option value="">Select a Vendor</option>
                    {vendorList.map((vendor) => (
                        <option key={vendor.vending} value = {vendor.vending}>
                            {vendor.vending}
                        </option>
                    ))}
                </select>
                
                <select id="partno" style={{width: '200px'}} onChange={{handlePartnoChange}} value={partno}>
                <option value="">Part #</option>
                    {partsList.map((parts) => (
                        <option key={parts.partno} value = {parts.partno}>
                            {parts.partno}
                        </option>
                    ))}
                </select>
                    
                <button onClick={addToOrder}>Add to order</button>
             
        <button onClick={submitOrder}>Place Order</button>  {/*will add order to the database*/} 
        </body>
        </>
    )
}

export default NewOrder;