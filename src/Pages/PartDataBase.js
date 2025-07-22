import React from "react";
import { useState, useMemo } from "react";
import PageHeader from "../Components/PageHeader";
import "./InputBox.css";
import { useTable, useSortBy } from "react-table";
import "../Table.css";
import Popup from "reactjs-popup";

function Table({ columns, data, handleEditClick, handleSavePartChanges, handleDeleteClick }) {

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
          <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
            {headerGroup.headers.map((column) => {
              const allProps = column.getHeaderProps(column.getSortByToggleProps());
              const { key, ...rest } = allProps;
                 
              return(
                  <th key={key} {...rest}>
                  {column.render("Header")}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                </span>
              </th>
            );
        })}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          const rowProps = row.getRowProps();
          return (
            <tr  key={row.id} {...rowProps} style={{backgroundColor: i % 2 === 0 ? "lightgreen" : "lightgray"}}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()} key={cell.column.id}>
                  {cell.render("Cell")}
                </td>
        ))}
            <td colSpan={columns.length}>
              <button style={{borderOutline: 'black', borderRadius: '8px', width: "100px", marginRight: "8px", backgroundColor: i % 2 === 0 ? "lightgreen" : "lightgray"}} onClick={() => handleEditClick(row)}>Edit Part</button>
              <button style={{borderOutline: 'black', borderRadius: '8px', width: "100px", marginRight: "8px", backgroundColor: i % 2 === 0 ? "lightgreen" : "lightgray"}} onClick={() => handleDeleteClick(row)}>Delete Part</button>
            </td>
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
  
  const [partToEdit, setPartToEdit] = useState(false);
  const [partToDelete, setPartToDelete] = useState([]);
  
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


  const handleEditClick = (row) => {
    console.log("handleEditClick launching ", row.original )
    setPartToEdit(true);
    
    setOriginalEditVendor(row.original.vendor);
    setOriginalEditPartNo(row.original.partno);
    setOriginalEditPartDesc(row.original.partdesc);
    setOriginalEditCost(row.original.cost);

    setEditVendor(row.original.vendor);
    setEditPartNo(row.original.partno);
    setEditPartDesc(row.original.partdesc);
    setEditCost(row.original.cost); 
  };
  const handleCloseEdit = () => {
    console.log("Close edit launching properly")
    setPartToEdit(null);
  }

  const handleDeleteClick = async() =>{
    console.log("Close delete launching properly")
    
    try{
      const deletePart={
        partno: editPartNo,
        partdesc: editPartDesc,
        cost: editCost,
      };
      console.log("Part for delete info: ", deletePart)
    
        const response = await fetch(`/DeletePart/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deletePart),
      });

      if (response.ok) {
        console.log("Part deleted successfully!");
        findRow({ preventDefault: () => {} });
        findPart();
        handleCloseEdit();
         
      }else {
        console.error("Failed to delete row:", response.statusText);
      }
    }  catch (error) {
      console.error("Error deleting: ", error);
      }
    }
  

  const handleSavePartChanges = async() => {
        console.log("Called handleSavePartChanges")
        console.log("Original part data: ",  originalEditPartNo, originalEditPartDesc, originalEditCost);
        console.log("Edit part data: ",  editPartNo, editPartDesc, editCost);

        try{
       const savePart = {
        partno: originalEditPartNo,
        partdesc: editPartDesc,
        cost: editCost,
        newPartNo: editPartNo
      };
      
      console.log("Saving changes for part:", savePart);
      
      if(originalEditVendor === savePart.vendor &&
        originalEditPartNo === savePart.partno &&
        originalEditPartDesc === savePart.partdesc &&
        originalEditCost === savePart.cost){
        
        console.log("No changes were made")
        handleCloseEdit()
        
        return
      } else {
      const response = await fetch(`/UpdateParts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(savePart),
      });

      if (response.ok) {
        console.log("Part updated successfully!");
        findRow({ preventDefault: () => {} });
        console.log("Making it to findpart() call: ", partNo);
        setVendor(originalEditVendor)
        handleCloseEdit(); 
      }else {
        console.error("Failed to update row:", response.statusText);
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

      for(let i = 0; responseData.length; i++){
        if(responseData.data[i].partno == null){
          responseData.data[i].splice(i, i+1);
        }
      }
      const vettedData = responseData;
      setData(vettedData);

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
      <h1 style={{display: 'flex', justifyContent: 'center'}}>What are we looking for today?</h1>
      <form style={{display: 'flex', justifyContent: 'center'}}>
        <input
          style={{borderOutline: 'black', borderRadius: '8px', width: "150px"}}
          type="text"
          className="buttonpadding"
          placeholder="vendor"
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
        />

        <input
          type="text"
          style={{borderOutline: 'black', borderRadius: '8px', width: "150px"}}
          className="buttonpadding"
          placeholder="part#"
          value={partNo}
          onChange={(e) => setPartNo(e.target.value)}
        />

        <input
          type="text"
          className="buttonpadding"
          style={{borderOutline: 'black', borderRadius: '8px', width: "150px"}}
          placeholder="Item Description"
          value={partDesc}
          onChange={(e) => setPartDesc(e.target.value)}
        />

        <input
          type="number"
          style={{borderOutline: 'black', borderRadius: '8px', width: "150px"}}
          className="buttonpadding"
          placeholder="cost"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
</form>
        <br></br>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <button style={{borderOutline: 'black', borderRadius: '8px', width: "100px", marginRight: "8px"}} onClick={findPart}>Find Part</button>
        <button style={{borderOutline: 'black', borderRadius: '8px', width: "100px", marginRight: "8px"}} onClick={newPart}>Create Part</button>
        <button style={{borderOutline: 'black', borderRadius: '8px', width: "100px", marginLeft: "8px"}}onClick={clearSearch}>Clear Search</button>
      </div>
      
{searchComplete === true &&
      <div style={{display: 'flex', justifyContent: 'center'}}>
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
}

      {partToEdit && (
        <Popup open={true} modal nested onClose={handleCloseEdit}>
          {(close) => {
            return(
              <>
            <div>
            <form style={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', height: '200px', border: '2px solid #333', backgroundColor: 'gray', borderRadius: '8px',}}>  
            <h1>Editing Part</h1>
            <div>VEND- 
              <input value={editVendor} onLoad={(e)=>setEditVendor(e.target.value)} readOnly/>
            </div>
            <div>
              PARTNo-
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

         {/*   {partToDelete && (
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
              <input value={data.partno} readOnly/>
            </div>
            <div>
              DESC-
              <input value={data.partdesc} readOnly/>
            </div>
            <div>
              COST-
              <input value={data.cost} readOnly/>
            </div>
            <button>Delete Part</button>
            <button onClick={handleCloseDelete}>Cancel</button>
            </form>
            </div>
            </>
            );
          }}
        </Popup>
      )}*/}

</>

  );
}

export default PartDataBase;
