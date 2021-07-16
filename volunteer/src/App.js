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

function App() {

  const [showRequestModal,setShowRequestModal] = useState(false);

  return (
  
      <div className="App">
        <AuthProvider>
          <Router history={history}>

            <Switch>

              <Route path="/login"> 
                <Login/>
              </Route>

              <AuthContext.Consumer>
                { userContext =>
          
                    (<PrivateRoute exact path="/home" user={userContext}>
                      <Header setShowRequestModal={setShowRequestModal}/>
                      <Home user={userContext}/>
                    </PrivateRoute>)
                  
                }
              
              </AuthContext.Consumer>

              <AuthContext.Consumer>
                { userContext => (

                  <PrivateRoute exact path="/chat">
                    <Header setShowRequestModal={setShowRequestModal}/>
                    <Chat user={userContext}/>
                  </PrivateRoute>
                )}
              </AuthContext.Consumer>

              <AuthContext.Consumer>
                { userContext => (
                  <PrivateRoute exact path="/leaderboard">
                    <Header setShowRequestModal={setShowRequestModal}/>
                    <Leaderboard user={userContext}/>
                  </PrivateRoute>
                )}
              </AuthContext.Consumer>

            </Switch>

          {
            showRequestModal ? 
            <AuthContext.Consumer>
              { userContext => (
                <PrivateRoute path="/">
                  <RequestModal user={userContext} setShowRequestModal={setShowRequestModal}/>
                </PrivateRoute>

              )}

            </AuthContext.Consumer>
            : null
          }

          </Router>  
        </AuthProvider>
      </div>  
  );
}

export default App;
