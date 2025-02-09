import React from 'react';
import {useNavigate} from 'react-router-dom'
import LoginPage from './Pages/LoginPage';

function App() {

  const navigate = useNavigate();

  function handleClick() {
    navigate('/LoginPage');
  }

  return (
    <div>
        <header>Welcome to Purchase Manager</header>
          <button onClick={handleClick}>Login</button>
          <button>Create New Account</button>    
    </div>
  );
}

export default App;
