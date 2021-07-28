import React, { useEffect, useState } from "react";
import app from "./firebase.js";
import history from './history.js';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => { 
      
    	console.log("auth state changed");

      if(user)
      {
        console.log("reached2");
        setCurrentUser(user);
      }

    });
  }, []);

  useEffect(()=>{
    if(currentUser !== null)
    {
      console.log("reached1");
      history.push("/home");
    }
  },[currentUser]);

  return (
    <AuthContext.Provider value={{currentUser,}}>
      {children}
    </AuthContext.Provider>
  );
};
