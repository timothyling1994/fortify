import React, { useContext,useEffect,useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./auth.js";

const PrivateRoute = (props) => {

  return (
    <div>
      {
        !(props.user.currentUser == null) ? 
          <div>
          {
            Object.keys(props.children).map(function(keyName,keyIndex){
                return props.children[keyName]
            })
          }

          </div> : 
        
          <Redirect to={"/login"} />
      }
    </div>
  );
};

export default PrivateRoute;