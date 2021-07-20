import React, { useEffect, useState } from "react";
import app from "./firebase.js";
import history from './history.js';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => { 
      
    	console.log("auth state changed");
      //console.log(user);

      if(user)
      {
        setCurrentUser(user);
      }

    });
  }, []);

  useEffect(()=>{
    if(currentUser !== null)
    {
      history.push("/home");
    }
  },[currentUser]);

  return (
    <AuthContext.Provider value={{currentUser,}}>
      {children}
    </AuthContext.Provider>
  );
};
