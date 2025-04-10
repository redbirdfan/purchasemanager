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
    const [partdesc, setPartDesc] = useState('');
    const [cost, setCost] = useState(null)
    const [quantity, setQuantity] = useState(null)
    const [total, setTotal] = useState(null)
    const [newOrder, setNewOrder] = useState([])
    const [newLine, setNewLine] = useState([]) 
    const [orderno, setOrderno] = useState(null)


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

       

    
        const handleVendorChange = async (event) => {
            console.log("Vendor handler is being called")
            event.stopPropagation()
            const selectedVendor = event.target.value;
            setVendor(selectedVendor);
            console.log("handleVendorChange selected vendor is: ", selectedVendor);

            if (selectedVendor) {
              console.log("Launching fetchparts for selectedVendor existing")
              console.log(selectedVendor)

              const searchParts = new URLSearchParams({vendor: selectedVendor})
              try {
                  const fetchParts = await fetch(`/partsList?${searchParts.toString()}`, { 
                      headers: {
                          credentials: "include",
                      },
                  });
                  if (fetchParts.ok) {
                      const partsData = await fetchParts.json(); 
                      console.log(partsData)
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
                      setPartDesc('');
                  }
              } catch (error) {
                  console.error("Error fetching parts:", error);
                  setPartsList([]);
              }
          } else {
            setPartsList([]);
          }
      };
        

    const handlePartnoChange = async (event) =>{
      console.log("Launching handlePartnoChange")
      const selectedPart = event.target.value;
      console.log(selectedPart)
      setPartno(selectedPart)

      console.log("Selected Part: ", selectedPart)

      if(selectedPart) {
        console.log("I have a selectedPart value")
        const getDescription = new URLSearchParams({ partno: selectedPart })
        try {
          const fetchDesc = await fetch(`/partsDesc?${getDescription.toString()}`, { 
            headers: {
                credentials: "include",
            },
        });

        if (fetchDesc.ok) {
          console.log("getDescription is ok")
          const descData = await fetchDesc.json(); 
          console.log("Description is ok: ", partdesc)
          
          setPartDesc(descData[0].partdesc)
          setCost(descData[0].cost)
          console.log("Line 160, Cost found: ", cost)
          console.log("Final part desc: ", partdesc)
      } else {
          console.error("Failed to fetch Description");
          setPartDesc([]);
          setCost('')
      }
  } catch (error) {
      console.error("Error fetching parts:", error);
      setPartDesc([]);
  }
  } else {
    setPartDesc([]);
  }
};
  
    function handleQuantity(quantity){
      console.log("I am trying to handle the quantity")
      setQuantity(quantity)
      console.log("Qty: ", quantity)
      console.log("Cost: ", cost)
      const sum = (quantity*cost)
      console.log("Sum: " , sum)
      setTotal(sum)

    }

    function addToOrder(){
        if(!orderno){
          alert("Purchase Order number required")
        } else {
        const addingLine = [orderno, partno, partdesc, cost, quantity, total];
        setNewOrder([...newOrder, addingLine])
        console.log("addingLine: ", addingLine)
        }
    }  

    useEffect(() => {
      console.log("Your new order: ", newOrder);
  }, [newOrder]);

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
            <input 
              type = "text"
              id = "orderNumber"
              value = { orderno }
              placeholder = "PO number"
              onChange={(e) => {setOrderno(e.target.value)}}
              />

            </header>
                <select id="vendor" style={{ width: '150px' }} onChange={ handleVendorChange } value={ vendor }>
                <option value="">Select a Vendor</option>
                    {vendorList.map((vendor) => (
                        <option key={vendor.vending} value = {vendor.vending}>
                            {vendor.vending}
                        </option>
                    ))}
                </select>
              
                
                <select id="partno" style={{width: '150px'}} onChange={ handlePartnoChange } value={ partno }>
                <option value="">Part #</option>
                    {partsList.map((parts) => (
                        <option key={parts.partno} value = {parts.partno}>
                            {parts.partno}
                        </option>
                    ))}
                </select>

                <input type="text" id="partDescDisplay" readOnly value={ partdesc } />

                <input type="text" id="partCostDisplay" readOnly value={ cost } />
                
                <input type='input' id = "orderQuantity" placeholder = "QTY" value={ quantity } onChange={(e) => {setQuantity(e.target.value); handleQuantity(e.target.value)}}/>

                <input type='number' id = 'linesum' placeholder = "Total" value = { total } />

                <button onClick={addToOrder}>Add to order</button>
             
                <button onClick={submitOrder}>Place Order</button>  {/*will add order to the database*/} 
                  
          <ul>
            {newOrder.map((item, index) => (
                <li key={index}>
                  {item.map((value, valueIndex) => (
                    <span key={valueIndex}>
                      {value}{valueIndex < item.length -1 ? ', ' :''}
                    </span>
                  ))}              
                </li>
              ))}
          </ul>
          </div>
        </>
    );
}

export default NewOrder;