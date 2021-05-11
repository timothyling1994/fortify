import './App.css';
import Header from "./components/Header.js";

import Chat from "./components/Chat.js";
import Home from "./components/Home.js";
import {useState,useEffect,useContext} from "react";
import RequestModal from "./components/RequestModal.js";
import Login from "./components/Login.js";
import { Router,Switch,Route } from "react-router-dom";
import firebase from "firebase";
import {startFirebaseUI}from './firebase.js';
import {AuthProvider} from "./auth.js";
import PrivateRoute from "./PrivateRoute.js";
import history from './history.js';
import { AuthContext } from "./auth.js";
//import firebaseui from "firebaseui";

function App() {

  const [currentUser,setCurrentUser] = useState(null);
  
  const [requests, setRequests] = useState([]);
  const [myRequests,setMyRequests] = useState([]);
  const [myTasks,setMyTasks] = useState([]);

  const [showRequestModal,setShowRequestModal] = useState(false);
  const [scrollToEntry,setScrollToEntry] = useState([]);

  const callFirestore = () => {
    
    let query = firebase.firestore().collection('requests');
    query.onSnapshot((snapshot)=>{
      let requestObjArr = [];
      snapshot.forEach((doc)=>{
        let requestObj = doc.data();
        requestObj.entryId = doc.id;
        requestObjArr.push(requestObj);
      });
      setRequests(requestObjArr); 
    });


    let myRequests_query = firebase.firestore().collection('users').doc(currentUser.token).collection('my_requests');
    myRequests_query.onSnapshot((snapshot)=>{
      let myRequestsObjArr = [];
      snapshot.forEach((doc)=>{
        let requestId = doc.data().requestId;
        firebase.firestore().collection('requests').doc(requestId).get().then((doc)=>
        {
          //console.log(doc.data());
          if(doc.exists)
          {
            let requestObj = doc.data();
            requestObj.entryId = requestId;
            myRequestsObjArr.push(requestObj);
          }
        })
      });
      setMyRequests(myRequestsObjArr); 
    });

    let myTasks_query = firebase.firestore().collection('users').doc(currentUser.token).collection('my_tasks');
    myTasks_query.onSnapshot((snapshot)=>{
      let myTasksObjArr = [];
      snapshot.forEach((doc)=>{
        let requestId = doc.data().requestId;
        firebase.firestore().collection('requests').doc(requestId).get().then((doc)=>
        {
          //console.log(doc.data());
          if(doc.exists)
          {
            let requestObj = doc.data();
            requestObj.entryId = requestId;
            myTasksObjArr.push(requestObj);
          }
        })
      });
      setMyTasks(myTasksObjArr); 
    });
  
  };

  const scrollToId = (divId) => {
    setScrollToEntry([divId]);
  };

  const setUser = (displayName,email,photoURL,token) => {
    console.log(token);
    setCurrentUser({
      displayName,
      email,
      photoURL,
      token,
    });
  };


  useEffect(()=>{
    if(currentUser !== null)
    {
      callFirestore();
    }
  },[currentUser]);


  return (
  
      <div className="App">
        <AuthProvider>
        {showRequestModal ? <RequestModal currentUser={currentUser} setShowRequestModal={setShowRequestModal}/> : null}
          <Router history={history}>
            <Header setShowRequestModal={setShowRequestModal}/>
            <Switch>
              <Route exact path="/login"> 
                <Login/>
              </Route>
              <PrivateRoute exact path="/home">
                <Home currentUser={currentUser} requests={requests} setUser={setUser} myRequests={myRequests} myTasks={myTasks} scrollToEntry={scrollToEntry} scrollToId={scrollToId}/>
              </PrivateRoute>
              <PrivateRoute exact path="/chat">
                <Chat currentUser={currentUser}/>
              </PrivateRoute>
            </Switch>
          </Router>  
        </AuthProvider>
      </div>  
  );
}

export default App;
