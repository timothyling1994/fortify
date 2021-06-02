import './App.css';
import Header from "./components/Header.js";

import Chat from "./components/Chat.js";
import Home from "./components/Home.js";
import {useState,useEffect,useContext} from "react";
import RequestModal from "./components/RequestModal.js";
import Login from "./components/Login.js";
import { Router,Switch,Route } from "react-router-dom";
import firebase from "firebase";
import PrivateRoute from "./PrivateRoute.js";
import Leaderboard from "./components/Leaderboard.js";
import history from './history.js';
import { AuthContext, AuthProvider } from "./auth.js";

function App() {

  const [showRequestModal,setShowRequestModal] = useState(false);

  return (
  
      <div className="App">
        <AuthProvider>
        {showRequestModal ? 
          <AuthContext.Consumer>
            { user => (<RequestModal user={user} setShowRequestModal={setShowRequestModal}/> )}
          </AuthContext.Consumer>
          : null
        }
          <Router history={history}>
            <Header setShowRequestModal={setShowRequestModal}/>
            <Switch>
              <Route exact path="/login"> 
                <Login/>
              </Route>

              <AuthContext.Consumer>
                { user => (

                  <PrivateRoute exact path="/home">
                    <Home user={user}/>
                  </PrivateRoute>

                )}
              
              </AuthContext.Consumer>

              <PrivateRoute exact path="/chat">
                <Chat/>
              </PrivateRoute>
              <Route exact path="/leaderboard"> 
                <Leaderboard/>
              </Route>
            </Switch>
          </Router>  
        </AuthProvider>
      </div>  
  );
}

export default App;
