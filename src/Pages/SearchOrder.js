import React from "react";
import { useState, useMemo, useEffect, useContext, } from "react";
import PageHeader from "../Components/PageHeader";
import { useTable, useSortBy } from "react-table";
import Popup from "reactjs-popup";
import "../Table.css";

function Table({ columns, data }) {
  console.log("Table received props: ", { columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );

  return (
    <table className="table-spacing" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render("Header")}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}
                style={{backgroundColor: row.i === 1 ? "lightgreen" : "whitesmoke"}}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>
                  {cell.render("Cell")}</td>;
              })}
              <button>Edit</button>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function SearchOrder() {
  const [orderno, setOrderno] = useState("");
  const [username, setUsername] = useState("");
  const [orderDate, setDate] = useState("");
  const [vendor, setVendor] = useState("");
  const [received, setReceived] = useState(false);
  const [partno, setPartno] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState({ data: []});
  
  const [partToEdit, setPartToEdit] = useState(null);
    const [partToDelete, setPartToDelete] = useState(null);
    
    const [originalPartToEdit, setOriginalPartToEdit] =useState("");
    const [originalEditVendor, setOriginalEditVendor] = useState("");
    const [originalEditPartNo, setOriginalEditPartNo] = useState("");
    const [originalEditPartDesc, setOriginalEditPartDesc] = useState("");
    const [originalEditCost, setOriginalEditCost] = useState("");
    
    const [editVendor, setEditVendor] = useState("");
    const [editPartNo, setEditPartNo] = useState("");
    const [editPartDesc, setEditPartDesc] = useState("");
    const [editCost, setEditCost] = useState("");

  function handleEditClick(row, i) {
    console.log("Edit click launched: ", row, i)
  };

  const findOrder = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      console.log("CAlling findOrder");
      const searchOrders = new URLSearchParams();
      console.log("SearchOrder before adding: ", searchOrders);

      if (orderno) {
        searchOrders.append("orderno", orderno);
      }

      if (vendor) {
        searchOrders.append("vendor", vendor);
      }

      if (partno) {
        searchOrders.append("partno", partno);
      }

      console.log("Looking for: ", searchOrders);

      const response = await fetch(`/orders?${searchOrders}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Calling for get orders");

      const responseData = await response.json();
      setData(responseData);
      console.log("Response Date", responseData);
      if (response.ok) {
        console.log("backend connection successful");
        console.log(responseData);
      } else {
        setErr("No response");
        console.log(err);
        setData({data: []});
      }
    } catch (err) {
      console.log("ERROR", err);
    }
  };

  function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }

  const columns = useMemo(
    () => [
      {
        Header: "Order#",
        accessor: "orderno",
      },
      {
        Header: "Vendor",
        accessor: "vendor",
      },
      {
        Header: "Part#",
        accessor: "partno",
      },
      {
        Header: "Description",
        accessor: "partdesc",
      },
      {
        Header: "Quantity",
        accessor: "quantity",
      },
      {
        Header: "Cost",
        accessor: "cost",
      },
      { 
        Header: "Total", 
        accessor: "total" },
    {
        Header: 'Received',
        accessor: 'received',
    },
    ],
    []
  );

  return (
    <>
      <header>
        <PageHeader />
      </header>
      <form style={{display: 'flex', justifyContent: 'center'}}>
        <input
          type="text"
          placeholder="Order Number"
          value={orderno}
          onChange={(e) => setOrderno(e.target.value)}
        />

        <button onClick={findOrder}>Find Order</button>
      </form>
      <div >
                    <Table columns={columns} data={data.data.map(order => ({
                        ...order,
                        orderno: order.orderno === null ? '' : order.orderno,
                        vendor: order.vendor === null ? '' : order.vendor,
                        partno: order.partno === null ? '' : order.partno,
                        partdesc: order.partdesc === null ? '' : order.partdesc,
                        quantity: order.quantity === null ? '' : order.quantity,
                        cost: order.cost === null ? '' : order.cost,
                        total: order.total === null ? '' : order.total,
                        received: order.received === null ? '' : order.received,
                    }))} 
                    />
            </div>
   {/*   {rowToEdit && (
               <Popup open={true} modal nested onClose={handleEditClick}>
                 {(close) => {
                   return(
                     <>
                   <div>
                   <form style={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', height: '200px', border: '2px solid #333', backgroundColor: 'gray', borderRadius: '8px',}}>  
                   <h1>Order line to Edit</h1>
                   <div>VEND- 
                     <input value={partToEdit.vendor} onLoad={(e)=>setVendorToEdit(e.target.value)} readOnly/>
                   </div>
                   <div>
                     PART-
                     <input value={partToEdit.partno} onChange={(e) => setEditPartNo(e.target.value)}/>
                   </div>
                   <div>
                     DESC-
                     <input value={partToEdit.partdesc} onChange={(e) => setEditPartDesc(e.target.value)}/>
                   </div>
                   <div>
                     COST-
                     <input value={partToEdit.cost} onChange={(e) => setEditCost(e.target.value)} numbers/>
                   </div>
                   <button onClick={handleOrderSaveChanges}>Save Changes</button>
                   <button onClick={handleCancelEdit}>Cancel</button>
                   </form>
                   </div>
                   </>
                   );
                 }}
               </Popup>
             )} */}
    </>
  );
}

export default SearchOrder;
