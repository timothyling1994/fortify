import React, { useContext,useEffect,useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./auth.js";


//{ comp: RouteComponent,...rest 
  //children:{header:header,home:home}, ...rest
const PrivateRoute = (props) => {

  const { currentUser } = useContext(AuthContext);



  //console.log(currentUser);
  //console.log(children.header);
  //console.log(children.home);
  
  return (
    <div>
      {
        !(currentUser == undefined) ? 
          <div>
          {props.children.header}
          {props.children.home}
          </div>: 
        <Redirect to={"/login"} />
      }
    </div>
  );
};

/*return (
    <Route {...rest}
      render={ routeProps =>
         !(currentUser == undefined) ? 
          <RouteComponent {...routeProps} user={currentUser} />
         : 
          <Redirect to={"/login"} />
        
      }
    />
  );*/
export default PrivateRoute;