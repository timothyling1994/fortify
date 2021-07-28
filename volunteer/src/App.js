import './App.css';

import { useState, useEffect, useContext} from "react";
import { Router, Switch, Route } from "react-router-dom";
import { AuthContext, AuthProvider } from "./auth.js";
import history from './history.js';
import firebase from "firebase";
import PrivateRoute from "./PrivateRoute.js";

import Login from "./components/Login.js";
import Header from "./components/Header.js";
import Home from "./components/Home.js";
import Chat from "./components/Chat.js";
import Leaderboard from "./components/Leaderboard.js";

import uniqid from "uniqid";

function App() {

  const [showRequestModal,setShowRequestModal] = useState(false);

  return (
  
      <div className="App">
        <AuthProvider>
          <Router history={history}>
            <AuthContext.Consumer>
            {
              userContext =>

              <Switch>

                <Route key={uniqid()} path="/login"> 
                  <Login/>
                </Route>

                <PrivateRoute exact path="/chat" user ={userContext} children={{header: <Header key={uniqid()} user={userContext}/>,chat:<Chat key={uniqid()} user={userContext}/>}}>
                </PrivateRoute>

                <PrivateRoute exact path="/home" user ={userContext} children={{header: <Header key={uniqid()} user={userContext}/>,home:<Home key={uniqid()} user={userContext}/>}}>
                </PrivateRoute>

                <PrivateRoute exact path="/leaderboard" user ={userContext} children={{header: <Header key={uniqid()} user={userContext}/>,home:<Leaderboard key={uniqid()} user={userContext}/>}}>
                </PrivateRoute>

              </Switch>
            }
            </AuthContext.Consumer>
          </Router>  
        </AuthProvider>
      </div>  
  );
}

export default App;
