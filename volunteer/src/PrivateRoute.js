import React from "react";
import { Redirect } from "react-router-dom";

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