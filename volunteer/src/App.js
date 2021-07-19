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
import RequestModal from "./components/RequestModal.js";
import Leaderboard from "./components/Leaderboard.js";

/*             <Header setShowRequestModal={setShowRequestModal}/>
                      <Home user={userContext}/>*/
function App() {

  const [showRequestModal,setShowRequestModal] = useState(false);

  /*          {
            showRequestModal ? 
            <AuthContext.Consumer>
              { userContext => (
                  <RequestModal user={userContext} setShowRequestModal={setShowRequestModal}/>
              )}

            </AuthContext.Consumer>
            : null
          }*/

  return (
  
      <div className="App">
        <AuthProvider>
          <Router history={history}>
            <AuthContext.Consumer>
            {
              userContext =>

              <Switch>

              <Route path="/login"> 
                <Login/>
              </Route>

              <PrivateRoute exact path="/chat" user ={userContext} children={{header: <Header setShowRequestModal={setShowRequestModal} user={userContext}/>,chat:<Chat user={userContext}/>}}>
              </PrivateRoute>

              <PrivateRoute exact path="/home" user ={userContext} children={{header: <Header setShowRequestModal={setShowRequestModal} user={userContext}/>,home:<Home user={userContext}/>}}>
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
