import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import './index.css';
import App from './App';
import Hub from './Pages/Hub'
import LoginPage from './Pages/LoginPage';
import NewOrder from './Pages/NewOrder';
import PartDataBase from './Pages/PartDataBase';
import SearchOrder from './Pages/SearchOrder';
import NewAccount from './Pages/NewAccount';
import reportWebVitals from './reportWebVitals';


function Routing() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<App />} />
            <Route path="LoginPage" element={<LoginPage />} />
            <Route path="NewOrder" element={<NewOrder />} />
            <Route path="PartDataBase" element={<PartDataBase />} />
            <Route path="SearchOrder" element={<SearchOrder />} />
            <Route path="Hub" element={<Hub />} />
            <Route path="NewAccount" element={<NewAccount />} />
      </Routes>
    </BrowserRouter>
  )
  
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Routing />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
