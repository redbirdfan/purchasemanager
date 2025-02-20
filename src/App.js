import React from 'react';
import {useNavigate} from 'react-router-dom'
import "./App.css";

function App() {

  const navigate = useNavigate();

  function handleLogin() {
    navigate('/LoginPage');
  }

  function createUser() {
    navigate('/NewAccount');
  }

  return (
    <div className='button-container'>

        <header>Welcome to Purchase Manager</header>
          <button style={{width:145}} onClick={handleLogin}>Login</button>
          <br></br>
          <button style={{width:145}} onClick={createUser}>Create New Account</button>    
    </div>
  );
}

export default App;
