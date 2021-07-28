import './App.css';

import { Router, Switch, Route } from "react-router-dom";
import { AuthContext, AuthProvider } from "./auth.js";
import history from './history.js';
import PrivateRoute from "./PrivateRoute.js";

import Login from "./components/Login.js";
import Header from "./components/Header.js";
import Home from "./components/Home.js";
import Chat from "./components/Chat.js";
import Leaderboard from "./components/Leaderboard.js";

import uniqid from "uniqid";

function App() {

  return (
  
      <div className="App">
        <AuthProvider>
          <Router history={history}>
            <AuthContext.Consumer>
            {
              userContext =>

              <Switch>

                <PrivateRoute exact path="/chat" user ={userContext} children={{header: <Header key={uniqid()} user={userContext}/>,chat:<Chat key={uniqid()} user={userContext}/>}}>
                </PrivateRoute>

                <PrivateRoute exact path="/home" user ={userContext} children={{header: <Header key={uniqid()} user={userContext}/>,home:<Home key={uniqid()} user={userContext}/>}}>
                </PrivateRoute>

                <PrivateRoute exact path="/leaderboard" user ={userContext} children={{header: <Header key={uniqid()} user={userContext}/>,home:<Leaderboard key={uniqid()} user={userContext}/>}}>
                </PrivateRoute>

                <Route key={uniqid()} path="/"> 
                  <Login/>
                </Route>

              </Switch>
            }
            </AuthContext.Consumer>
          </Router>  
        </AuthProvider>
      </div>  
  );
}

export default App;
