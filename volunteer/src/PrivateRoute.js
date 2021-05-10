import React, { useContext,useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./auth.js";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { currentUser } = useContext(AuthContext);
  //const [currentUser, setCurrentUser] = useState()
  //PrivateRoute.contextType = AuthContext;
  console.log("private:"+currentUser);

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        !!currentUser ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={"/login"} />
        )
      }
    />
  );
};

export default PrivateRoute;