import React from "react";
import { UserContext } from "../UserContext";
import { useState, useEffect, useContext } from "react";
import PageHeader from "../Components/PageHeader";

function NewOrder() {
  const user = useContext(UserContext);
  const [vendorList, setVendorList] = useState([]);
  const [vendor, setVendor] = useState("");
  const [partsList, setPartsList] = useState([]);
  const [partno, setPartno] = useState();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [partdesc, setPartDesc] = useState("");
  const [cost, setCost] = useState("");
  const [quantity, setQuantity] = useState(null);
  const [total, setTotal] = useState(null);
  const [newOrder, setNewOrder] = useState([]);
  const [orderno, setOrderno] = useState(null);
  const [readState, setReadState] = useState(false);
  const received = "No";

  const handleVendorChange = async (event) => {
    console.log("Vendor handler is being called");
    event.stopPropagation();
    const selectedVendor = event.target.value;
    setVendor(selectedVendor);
    console.log("handleVendorChange selected vendor is: ", selectedVendor);

    if (selectedVendor) {
      console.log("Launching fetchparts for selectedVendor existing");
      console.log(selectedVendor);

      const searchParts = new URLSearchParams({ vendor: selectedVendor });
      try {
        const fetchParts = await fetch(`/partsList?${searchParts.toString()}`, {
          headers: {
            credentials: "include",
          },
        });
        if (fetchParts.ok) {
          const partsData = await fetchParts.json();
          console.log(partsData);
          const sortedPartsData = [...partsData].sort((a, b) => {
            if (a.partno < b.partno) {
              return -1;
            }
            if (a.partno > b.partno) {
              return 1;
            }
            return 0;
          });
          console.log(sortedPartsData);
          setPartsList(sortedPartsData);
          setReadState(true);
        } else {
          console.error("Failed to fetch parts");
          setPartsList([]);
          setPartDesc("");
        }
      } catch (error) {
        console.error("Error fetching parts:", error);
        setPartsList([]);
      }
    } else {
      setPartsList([]);
    }
  };

  const handlePartnoChange = async (event) => {
    console.log("Launching handlePartnoChange");
    const selectedPart = event.target.value;
    console.log(selectedPart);
    setPartno(selectedPart);

    console.log("Selected Part: ", selectedPart);

    if (selectedPart) {
      console.log("I have a selectedPart value");
      const getDescription = new URLSearchParams({ partno: selectedPart });
      try {
        const fetchDesc = await fetch(
          `/partsDesc?${getDescription.toString()}`,
          {
            headers: {
              credentials: "include",
            },
          }
        );

        if (fetchDesc.ok) {
          console.log("getDescription is ok");
          const descData = await fetchDesc.json();
          console.log("Description is ok: ", partdesc);

          setPartDesc(descData[0].partdesc);
          setCost(descData[0].cost);

          console.log("Line 160, Cost found: ", cost);
          console.log("Final part desc: ", partdesc);
          console.log("Total: ", total)
        } else {
          console.error("Failed to fetch Description");
          setPartDesc([]);
          setCost("");
        }
      } catch (error) {
        console.error("Error fetching parts:", error);
        setPartDesc([]);
      }
    } else {
      setPartDesc([]);
    }
  };

  function handleQuantity(quantity) {
    console.log("I am trying to handle the quantity");
    setQuantity(quantity);
    console.log("Qty: ", quantity);
    console.log("Cost: ", cost);
    const sum = quantity * cost;
    console.log("Sum: ", sum);
    setTotal(sum);
  }

  async function checkOrderNo(orderno) {
    try {
      console.log("checking order number is unique");
      const response = await fetch(`/checkOrderNo?orderno=${orderno}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let checkOrder = response;
      console.log("Response: ", checkOrder);

      if (response.ok) {
        const data = await response.json();
        console.log("order number check response:", data[0]);

        if (data[0].length !== 0) {
          alert("Order number already exists, please select another one");
          setOrderno("");
        } else {
          setOrderno(orderno);
          setReadState(true);
        }
      } else {
        console.error("No response: ", response.status, response.statusText);
        setErr("Error checking order number.");
      }
    } catch (error) {
      console.error("ERROR checking order number:", error);
      setErr("Error checking order number.");
    }
  }

  function addToOrder() {
    if (!orderno) {
      alert("Purchase Order number required");
    } else if (!vendor) {
      alert("Vendor is required");
    } else if (!partno) {
      alert("Please select a part number");
    } else if (quantity < 1 || quantity == null) {
      alert("You must select a quantity");
    } else {
      const addingLine = [
        orderno,
        vendor,
        partno,
        partdesc,
        cost,
        quantity,
        total,
        received
      ];
      setNewOrder([...newOrder, addingLine]);
      console.log("addingLine: ", addingLine);
      setQuantity("");
      setPartno("");
      setPartDesc("");
      setCost("");
      setTotal("");
    }
  }

  const handleNoChange = (e) => {
    setOrderno(e.target.value);
  };

  const handleNoBlur = (e) => {
    if (orderno) {
      checkOrderNo(orderno);
    }
  };

  useEffect(() => {
    console.log("Your new order: ", newOrder);
  }, [newOrder]);

  async function submitOrder() {
    try {
      console.log("submitting order");
      console.log("OrderNo: ", orderno, "cost: ", cost, "Received state: ", received);
      console.log(newOrder[0]);
      const response = await fetch("/newOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newOrder }),
      });

      console.log(response);

      if (response.ok) {
        const data = await response.json();
        console.log("New order data sent to the backend");
        console.log(data);
        setOrderno("");
        setVendor("");
        setPartno("");
        setPartDesc("");
        setCost("");
        setQuantity("");
        setTotal("");
      } else {
        setErr("No response");
        console.log(err);
      }
    } catch (err) {
      console.log("ERROR sending data to the backend");
    }
  }

  return (
    <>
      <header>Place your order...</header>

      <div>
        
          <PageHeader />
          <br></br>
          <input
            type="text"
            id="orderNumber"
            value={orderno}
            placeholder="PO number"
            onChange={handleNoChange}
            onBlur={handleNoBlur}
            readOnly={readState}
          />
      
        <select
          id="vendor"
          style={{ width: "150px" }}
          onChange={handleVendorChange}
          value={vendor}
        >
          <option value="" readOnly={readState}>
            Select a Vendor
          </option>
          {vendorList.map((vendor) => (
            <option key={vendor.vending} value={vendor.vending}>
              {vendor.vending}
            </option>
          ))}
        </select>
        <select
          id="partno"
          style={{ width: "150px" }}
          onChange={handlePartnoChange}
          value={partno}
        >
          <option value="">Part #</option>
          {partsList.map((parts) => (
            <option key={parts.partno} value={parts.partno}>
              {parts.partno}
            </option>
          ))}
        </select>
        <input type="text" id="partDescDisplay" readOnly value={partdesc} />
        <input type="text" id="partCostDisplay" readOnly value={cost} />
        <input
          type="input"
          id="orderQuantity"
          placeholder="QTY"
          value={quantity}
          onChange={(e) => {
            setQuantity(e.target.value);
            handleQuantity(e.target.value);
          }}
        />
        <input type="number" id="linesum" placeholder="Total" value={total} />
        <button onClick={addToOrder}>Add to order</button>
        <button onClick={submitOrder}>Place Order</button>{" "}
        {/*will add order to the database*/}
        <ul>
          {newOrder.map((item, index) => (
            <li key={index}>
              {item.map((value, valueIndex) => (
                <span key={valueIndex}>
                  {value}
                  {valueIndex < item.length - 1 ? ", " : ""}
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
