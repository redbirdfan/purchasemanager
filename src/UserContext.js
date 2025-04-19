import React, { createContext, useState, useContext } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);



  const setUser = (firstName, lastName) => {
    setFirstName(firstName);
    setLastName(lastName);
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