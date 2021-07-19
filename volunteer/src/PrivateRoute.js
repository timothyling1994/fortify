import React, { useContext,useEffect,useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./auth.js";

const PrivateRoute = (props) => {

  console.log(props.user);

  return (
    <div>
      {
        !(props.user.currentUser == undefined || props.user.currentUser == null) ? 
          <div>
          {
            //props.children.map()
          }
          {props.children.header}
          {props.children.home}
          </div> : 
        
          <Redirect to={"/login"} />
      }
    </div>
  );
};

export default PrivateRoute;