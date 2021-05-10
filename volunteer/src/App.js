import './App.css';
import Header from "./components/Header.js";
import MapImage from "./components/MapImage.js";
import DeliveriesPanel from "./components/DeliveriesPanel.js";
import Chat from "./components/Chat.js";
import {useState,useEffect} from "react";
import RequestModal from "./components/RequestModal.js";
import Login from "./components/Login.js";
import { Router,Switch,Route } from "react-router-dom";
import firebase from "firebase";
import {startFirebaseUI}from './firebase.js';
import {AuthProvider} from "./auth.js";
import PrivateRoute from "./PrivateRoute.js";
import history from './history.js';
//import firebaseui from "firebaseui";

function App() {

  const [showRequestModal,setShowRequestModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [myRequests,setMyRequests] = useState([]);
  const [myTasks,setMyTasks] = useState([]);
  const [scrollToEntry,setScrollToEntry] = useState([]);

  const initFirestore = () => {
    //requestsRef.current = [];
    
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


    let myRequests_query = firebase.firestore().collection('users').doc('firebaseId').collection('my_requests');
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

    let myTasks_query = firebase.firestore().collection('users').doc('firebaseId').collection('my_tasks');
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

  useEffect(()=>{
    initFirestore();
  },[]);

  /*<PrivateRoute exact path="/home" component={
                  <div className="main-content">
                    <DeliveriesPanel requests={requests} myRequests={myRequests} myTasks={myTasks} scrollToEntry={scrollToEntry}/>
                    <MapImage requests={requests} scrollToId={scrollToId}/>
                  </div>
              }/>

               <Route exact path="/login" render={() => (<Login/>)}/>
  */

  return (
  
      <div className="App">
        <AuthProvider>
        {showRequestModal ? <RequestModal setShowRequestModal={setShowRequestModal}/> : null}
          <Router history={history}>
            <Header setShowRequestModal={setShowRequestModal}/>
            <Switch>
              <Route exact path="/login"> 
                <Login/>
              </Route>
              <PrivateRoute exact path="/home">
                <div className="main-content">
                    <DeliveriesPanel requests={requests} myRequests={myRequests} myTasks={myTasks} scrollToEntry={scrollToEntry}/>
                    <MapImage requests={requests} scrollToId={scrollToId}/>
                </div>
              </PrivateRoute>
              <PrivateRoute exact path="/chat">
                <Chat/>
              </PrivateRoute>
            </Switch>
          </Router>  
        </AuthProvider>
      </div>  
  );
}

export default App;
