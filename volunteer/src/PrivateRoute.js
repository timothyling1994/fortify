import React, { useContext,useEffect,useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./auth.js";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {

  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);

  //const [currentUser, setCurrentUser] = useState(false);
  
  return (
    <Route
      {...rest}
      render={(routeProps) =>
         currentUser ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={"/login"} />
        )
      }
    />
  );
};

export default PrivateRoute;