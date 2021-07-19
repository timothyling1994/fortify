import React, { useContext,useEffect,useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./auth.js";

const PrivateRoute = (props) => {

  console.log(props.user.currentUser);
  console.log(props.children);

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