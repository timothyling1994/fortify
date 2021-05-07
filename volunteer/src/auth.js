import React, { useEffect, useState } from "react";
import app from "./firebase.js";

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {

    
      setCurrentUser(user);

    });
  }, []);
  return (
    <AuthContext.Provider value={{currentUser,}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;