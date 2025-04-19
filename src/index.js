import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Hub from "./Pages/Hub";
import LoginPage from "./Pages/LoginPage";
import NewOrder from "./Pages/NewOrder";
import PartDataBase from "./Pages/PartDataBase";
import SearchOrder from "./Pages/SearchOrder";
import NewAccount from "./Pages/NewAccount";
import reportWebVitals from "./reportWebVitals";
import Receiving from "./Pages/Receiving";
import Vendor from "./Pages/Vendor";
import { UserProvider } from "./UserContext";
    
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="LoginPage" element={<LoginPage />} />
        <Route path="NewOrder" element={<NewOrder />} />
        <Route path="PartDataBase" element={<PartDataBase />} />
        <Route path="SearchOrder" element={<SearchOrder />} />
        <Route path="Hub" element={<Hub />} />
        <Route path="NewAccount" element={<NewAccount />} />
        <Route path="Receiving" element={<Receiving />} />
        <Route path="Vendors" element={<Vendor />} />
      </Routes>
    </BrowserRouter>
  </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
