import React from 'react';
import {useNavigate} from 'react-router-dom'
import LoginPage from './Pages/LoginPage';
import NewAccount from './Pages/NewAccount';

function App() {

  const navigate = useNavigate();

  function handleLogin() {
    navigate('/LoginPage');
  }

  function createUser() {
    navigate('/NewAccount');
  }

  return (
    <div>
        <header>Welcome to Purchase Manager</header>
          <button onClick={handleLogin}>Login</button>
          
          <button onClick={createUser}>Create New Account</button>    
    </div>
  );
}

export default App;
