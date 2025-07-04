import React from "react";
import { useState, useMemo, useEffect, useContext, } from "react";
import PageHeader from "../Components/PageHeader";
import { useTable, useSortBy } from "react-table";
import Popup from "reactjs-popup";
import "../Table.css";

function Table({ columns, data, handleEditClick }) {
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
                style={{backgroundColor: i % 2 == 0 ? "lightgreen" : "lightgray"}}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>
                  {cell.render("Cell")}</td>;
              })}
              <button style={{backgroundColor: i % 2 == 0 ? "lightgreen" : "lightgray"}} onClick={() => handleEditClick(row.original)}>Edit</button>
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
  const [received, setReceived] = useState("");
  const [partno, setPartno] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState({ data: []});
  
  const [rowToEdit, setRowToEdit] = useState(null);
    
  const [originalRowToEdit, setOriginalRowToEdit] =useState("");
  const [originalEditVendor, setOriginalEditVendor] = useState("");
  const [originalEditPartNo, setOriginalEditPartNo] = useState("");
  const [originalEditPartDesc, setOriginalEditPartDesc] = useState("");
  const [originalEditCost, setOriginalEditCost] = useState("");
  const [originalEditReceived, setOriginalEditReceived] = useState("");
    
  
  const [editPartNo, setEditPartNo] = useState("");
  const [editPartDesc, setEditPartDesc] = useState("");
  const [editCost, setEditCost] = useState("");
  const [editTotal, setEditTotal] = useState("");
  const [editReceived, setEditReceived] = useState("");

  
  const handleEditClick = (row) => {
    setRowToEdit(row);
    setOriginalRowToEdit(row);
    setOriginalEditVendor(row.vendor);
    setOriginalEditPartNo(row.partno);
    setOriginalEditPartDesc(row.partdesc);
    setOriginalEditCost(row.cost);
  }

    function handleCloseEdit(){
    console.log("Calling close edit");
  }

  
const handleRowSaveChanges = async () => {
    console.log("handleSavePartChanges launching")
    console.log("Row to Edit: ", rowToEdit)
    try{
       const updatedRow = {
        vendor: editVendor,
        partno: editPartNo,
        partdesc: editPartDesc,
        cost: editCost,
        total: editTotal,
        received: editReceived,
      };

      console.log("Saving changes for part:", updatedPart);
      
      if(originalEditVendor === updatedRow.vendor &&
        originalEditPartno === updatedRow.partno &&
        originalEditPartDesc === updatedRow.partdesc &&
        originalEditCost === updatedRow.cost &&
        originalEditReceived === updatedRow.received){
        console.log("No changes were made")
        handleCloseEdit()
        return
      } else {
      const response = await fetch(`/orders/${rowToEdit}+${data}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rowToEdit),
      });

      if (response.ok) {
        console.log("Row updated successfully!");
        findRow({ preventDefault: () => {} });
        handleCloseEdit(); 
      } else {
        console.error("Failed to update row:", response.statusText);
      }
    }  
  } catch (error) {
      console.error("Error saving changes:", error);
      }
    }


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

  {/*function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }
*/}
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
                    handleEditClick={handleEditClick} 
                    />
            </div>
      {rowToEdit && (
               <Popup open={true} modal nested onClose={handleCloseEdit}>
                 {(close) => {
                   return(
                     <>
                   <div>
                   <form style={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', height: '250px', border: '2px solidd #333', backgroundColor: 'gray', borderRadius: '8px',}}>  
                   <h1>Editing Order Row</h1>
                   <div>VEND- 
                     <input value={rowToEdit.vendor} onLoad={(e)=>setVendorToEdit(e.target.value)} readOnly/>
                   </div>
                   <div>
                     PART-
                     <input value={rowToEdit.partno} onChange={(e) => setEditPartNo(e.target.value)}/>
                   </div>
                   <div>
                     DESC-
                     <input value={rowToEdit.partdesc} onChange={(e) => setEditPartDesc(e.target.value)}/>
                   </div>
                   <div>
                     COST-
                     <input value={rowToEdit.cost} onChange={(e) => setEditCost(e.target.value)} numbers/>
                   </div>
                   <div>
                    REC'D-
                     <input value={rowToEdit.received} onChange={(e) => setEditReceived(e.target.value)}/>
                   </div>
                   <div>
                   <button onClick={handleRowSaveChanges}>Save Changes</button>
                   <button onClick={handleCloseEdit}>Cancel</button>
                   </div>
                   </form>
                   </div>
                   </>
                   );
                 }}
               </Popup>
             )} 
    </>
  );
}

export default SearchOrder;
