import React, { createContext, useState, useContext } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const setUser = (userData) => {
    console.log("setUser being called")
    setFirstName(userData.firstName);
    setLastName(userData.lastName);
    setUsername(userData.username);
    setIsLoggedIn(true);
  };

  const clearUser = () => {
    setFirstName('');
    setLastName('');
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider value={{ firstName, lastName, isLoggedIn, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};


export default UserProvider