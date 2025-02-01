import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import './index.css';
import App from './App';
import LoginPage from './Pages/LoginPage';
import NewOrder from './Pages/NewOrder';
import PartDataBase from './Pages/PartDataBase';
import SearchRecOrder from './Pages/SearchRecOrder';
import reportWebVitals from './reportWebVitals';


export default function Routing() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="LoginPage" element={<LoginPage />} />
          <Route path="NewOrder" element={<NewOrder />} />
          <Route path="PartDataBase" element={<PartDataBase />} />
          <Route path="SearchRecOrders" element={<SearchRecOrder />} />
      </Routes>
    </BrowserRouter>
  )
  
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
