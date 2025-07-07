import React from "react";
import { useState, useMemo } from "react";
import PageHeader from "../Components/PageHeader";
import "./InputBox.css";
import { useTable, useSortBy } from "react-table";
import "../Table.css";
import Popup from "reactjs-popup";

function Table({ columns, data, handleEditClick, handleDeleteClick }) {

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
            ))}d
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={row.id} style={{backgroundColor: i % 2 == 0 ? "lightgreen" : "lightgray"}}>
              
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()} key={cell.column.id}>
                  {cell.render("Cell")}
                </td>;
              })}
              <button style={{backgroundColor: i % 2 == 0 ? "lightgreen" : "lightgray"}} onClick={() => handleEditClick(row.original)}>Edit Part</button>
              <button style={{backgroundColor: i % 2 == 0 ? "lightgreen" : "lightgray"}} onClick={() => handleDeleteClick(row.original)}>Delete Part</button>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function PartDataBase() {
  const [vendor, setVendor] = useState("");
  const [partNo, setPartNo] = useState("");
  const [partDesc, setPartDesc] = useState("");
  const [cost, setCost] = useState("");
  const [err, setErr] = useState("");
  const [data, setData] = useState({ data: [] });
  const [searchComplete, setSearchComplete] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLasftName] = useState("");
  const [loading, setLoading] = useState(true);
  const [popout, setPopout] = useState(false);
  
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
  
  const [deleteVendor, setDeleteVendor] = useState("");
  const [deletePartNo, setDeletePartNo] = useState("");
  const [deletePartDesc, setDeletePartDesc] = useState("");
  const [deleteCost, setDeleteCost] = useState("");


  const handleEditClick = (partData) => {
    console.log("handleEditClick launching")
    setPartToEdit(partData);
    setOriginalPartToEdit(partData);
    setOriginalEditVendor(partData.vendor);
    setOriginalEditPartNo(partData.partno);
    setOriginalEditPartDesc(partData.partdesc);
    setOriginalEditCost(partData.cost);
    setEditVendor(partData.vendor);
    setEditPartNo(partData.partno);
    setEditPartDesc(partData.partdesc);
    setEditCost(partData.cost);
  };

  function handleDeleteClick(partData) {
    console.log("handleDeleteClick launching, asigning partData to setPartToDelete")
    console.log("Part Data: ", partData)
    setPartToDelete(partData);
    setDeleteVendor(partData.vendor);
    setDeletePartNo(partData.partno);
    setDeletePartDesc(partData.partdesc);
    setDeleteCost(partData.cost);
  }

  const handlePartDelete = async (partToDelete) => {
    console.log("(partToDelete Value) Launching when popup call delete clicked: ", partToDelete);
    try{
      console.log("Attempting to delete part: ", partToDelete);
      const response = await fetch("/parts", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(partToDelete),
      });
      console.log("DELETE response: ", response);
    
       if (response.ok) {
                const data = await response.json(); 
                console.log("Part deleted successfully:", data);
                setErr("Part deleted successfully!"); 
      
            } else {
                const errorData = await response.json();
                const errorMessage = "Failed to delete part";
                setErr(errorMessage);
                console.error("Delete Part Error:", errorMessage, "Status:", response.status);
            }
        } catch (error) {
            console.error("Network or unexpected error during DELETE request:", error);
            setErr(`Network error: ${error.message}. Please check your backend server.`);
        }
    }


  const handleCloseEdit = () => {
    console.log("Close edit launching properly")
    setPartToEdit(null);
  }

  const handleCloseDelete = () =>{
    console.log("Close delete launching properly")
    setPartToDelete(null);
  }

  const handleSavePartChanges = async () => {
    console.log("handleSavePartChanges launching")
    console.log("Original Part to Edit: ", originalPartToEdit)
    try{
       const updatedPart = {
        vendor: editVendor,
        partno: editPartNo,
        partdesc: editPartDesc,
        cost: editCost,
      };

      console.log("Saving changes for part:", updatedPart);
      
      if(originalEditVendor === updatedPart.vendor &&
        originalEditPartno === updatedPart.partno &&
        originalEditPartDesc === updatedPart.partdesc &&
        originalEditCost === updatedPart.cost){
        console.log("No changes were made")
        handleCloseEdit()
        return
      } else {
      const response = await fetch(`/UpdateParts/${partToEdit}+${data}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(partToEdit),
      });

      if (response.ok) {
        console.log("Part updated successfully!");
        findPart({ preventDefault: () => {} });
        handleCloseEdit(); 
      } else {
        console.error("Failed to update part:", response.statusText);
      }
    }  
  } catch (error) {
      console.error("Error saving changes:", error);
      }
    }


  function clearSearch() {
    setVendor("");
    setPartNo("");
    setPartDesc("");
    setCost("");
    setErr("");
    setData({ data: [] });
    setSearchComplete(false);
  }

  const findPart = async (e) => {
    e.preventDefault();
    setErr("");
    setSearchComplete(true);
    try {
      const searchFields = new URLSearchParams();

      if (vendor) {
        searchFields.append("vendor", vendor);
      }

      if (partNo) {
        searchFields.append("partno", partNo);
      }

      if (partDesc) {
        searchFields.append("partdesc", partDesc);
      }

      if (cost) {
        searchFields.append("cost", cost);
      }

      const response = await fetch(`/parts?${searchFields}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      setData(responseData);

      if (response.ok) {
        console.log("Response Data only value", responseData.data);
      } else {
        setErr("No response");
        console.log(err);
        setData({ data: [] });
      }
    } catch (err) {
      console.log("ERROR", err);
    }
  };

  const newPart = async (e) => {
    e.preventDefault();
    setErr("");

    if (!vendor || !partNo || !partDesc || !cost) {
      setErr("Required field missing");
      console.log("Required field missing");
      alert("Missing required field to create new part");
      return;
    } else {
      try {
        console.log("trying to post");
        const response = await fetch("/parts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ vendor, partNo, partDesc, cost }),
        });

        console.log(response);

        if (response.ok) {
          const data = await response.json();

          console.log(data);
        } else {
          setErr("No response");
          console.log(err);
        }
      } catch (err) {
        console.log("ERROR");
      }
    }
  };


  const columns = useMemo(
    () => [
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
        Header: "Cost",
        accessor: "cost",
      },
    ],
    []
  );

  return (
    <>
      {loading === false && <p>{"User: " + firstName + " " + lastName}</p>}
      <header>
        <PageHeader />
      </header>
      <h1>What are we looking for today?</h1>
      <form style={{display: 'flex', justifyContent: 'center'}}>
        <input
          type="text"
          className="buttonpadding"
          placeholder="vendor"
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
        />

        <input
          type="text"
          className="buttonpadding"
          placeholder="part#"
          value={partNo}
          onChange={(e) => setPartNo(e.target.value)}
        />

        <input
          type="text"
          className="buttonpadding"
          placeholder="Item Description"
          value={partDesc}
          onChange={(e) => setPartDesc(e.target.value)}
        />

        <input
          type="number"
          className="buttonpadding"
          placeholder="cost"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
</form>
        <br></br>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <button onClick={findPart}>Find Part</button>
        <button onClick={newPart}>Create Part</button>
        <button onClick={clearSearch}>Clear Search</button>
      </div>
      

      <div>
        <Table
          columns={columns}
          data={data.data.map((item) => ({
            ...item,
            vendor: item.vendor === null ? "" : item.vendor,
            partno: item.partno === null ? "" : item.partno,
            partdesc: item.partdesc === null ? "" : item.partdesc,
            cost: item.cost === null ? "" : item.cost,
          }))}  
           handleEditClick={handleEditClick} 
           handleDeleteClick={handleDeleteClick}          
        />
      </div>
      {partToEdit && (
        <Popup open={true} modal nested onClose={handleCloseEdit}>
          {(close) => {
            return(
              <>
            <div>
            <form style={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', height: '200px', border: '2px solid #333', backgroundColor: 'gray', borderRadius: '8px',}}>  
            <h1>Editing Part</h1>
            <div>VEND- 
              <input value={editVendor} onLoad={(e)=>setPartToEdit.vendor(e.target.value)} readOnly/>
            </div>
            <div>
              PART-
              <input value={editPartNo} onChange={(e) => setEditPartNo(e.target.value)}/>
            </div>
            <div>
              DESC-
              <input value={editPartDesc} onChange={(e) => setEditPartDesc(e.target.value)}/>
            </div>
            <div>
              COST-
              <input value={editCost} onChange={(e) => setEditCost(e.target.value)} numbers/>
            </div>
            <button onClick={handleSavePartChanges}>Save Changes</button>
            <button onClick={handleCloseEdit}>Cancel</button>
            </form>
            </div>
            </>
            );
          }}
        </Popup>
)}

            {partToDelete && (
        <Popup open={true} modal nested onClose={handleCloseDelete}>
          {(close) => {
            return(
              <>
            <div>
            <form style={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', height: '200px', border: '2px solid #333', backgroundColor: 'gray', borderRadius: '8px',}}>  
            <h3>Do you really want to delete this part?</h3>
            <div>VEND- 
              <input value={partToDelete.vendor} readOnly/>
            </div>
            <div>
              PART-
              <input value={partToDelete.partno} readOnly/>
            </div>
            <div>
              DESC-
              <input value={partToDelete.partdesc} readOnly/>
            </div>
            <div>
              COST-
              <input value={partToDelete.cost} readOnly/>
            </div>
            <button onClick={handlePartDelete()}>Delete Part</button>
            <button onClick={handleCloseDelete()}>Cancel</button>
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

export default PartDataBase;
