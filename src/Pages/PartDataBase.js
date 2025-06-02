import React from "react";
import { useState, useMemo } from "react";
import PageHeader from "../Components/PageHeader";
import "./InputBox.css";
import { useTable, useSortBy } from "react-table";
import "../Table.css";
import Popup from "reactjs-popup";

function Table({ columns, data }) {
  function editPart() {
    alert("edit under construction");
  }

  function deletePart() {
    alert("Ability to delete is under construction");
  }

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
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
              <Popup trigger={<button>Edit Part</button>} modal nested>
                {(close) => (
                  <div style={{backgroundColor: 'gray', width: '450px', height: '450'}}>
                    <div>Vendor: 
                      <input style={{display: 'flex', justifyContent: 'center'}} placeholder= "Vendor position" readOnly/>
                    </div>
                    <div>Part#: 
                      <input style={{display: 'flex', justifyContent: 'center'}} placeholder="Part# here"/>
                    </div>
                    <div>Description: 
                      <input style={{display: 'flex', justifyContent: 'center'}} placeholder="Part Description"/>
                    </div>
                    <div>Cost: 
                      <input style={{display: 'flex', justifyContent: 'center'}} placeholder="Part cost here" />
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                      <button onClick={() => close()} style={{ backgroundColor: 'black', color: 'whitesmoke'}}>Save Edits</button>
                    </div>
                  </div>
                )}
              </Popup>
              <button>Delete Part</button>
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
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);
  const [popout, setPopout] = useState(false);

  function clearSearch() {
    setVendor("");
    setPartNo("");
    setPartDesc("");
    setCost("");
    setErr("");
    setData({ data: [] });
    setSearchComplete(false);
    console.log("data and fields wiped");
    console.log("vendor:" + vendor);
  }

  const findPart = async (e) => {
    e.preventDefault();
    setErr("");
    setSearchComplete(true);
    console.log("SearchComplete Status: ", searchComplete);
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
      console.log("Type: ", typeof data.data);

      if (response.ok) {
        console.log("backend connection successful");
        console.log("ResponseData: ", responseData);
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

  function editPart() {
    alert("edit under construction");
  }
  function deletePart() {
    alert("Ability to delete is under construction");
  }

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
  console.log("Columns: ", columns);
  console.log("Prerender: ", data);
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
        <button onClick={newPart}>Add Part</button>
        <button onClick={deletePart}>Delete Part</button>
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
        />
      </div>
    </>
  );
}

export default PartDataBase;
