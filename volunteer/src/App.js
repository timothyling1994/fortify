import './App.css';
import Header from "./components/Header.js";
import MapImage from "./components/MapImage.js";
import DeliveriesPanel from "./components/DeliveriesPanel.js";
import Chat from "./components/Chat.js";
import {useState,useEffect} from "react";
import RequestModal from "./components/RequestModal.js";
import Login from "./components/Login.js";
import { BrowserRouter,Switch,Route } from "react-router-dom";
import firebase from "firebase";
import {startFirebaseUI}from './firebase.js';
import { AuthProvider } from "./auth.js";
import PrivateRoute from "./PrivateRoute.js";
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

  return (
    <div className="App">
      <AuthProvider>
      {showRequestModal ? <RequestModal setShowRequestModal={setShowRequestModal}/> : null}
        <BrowserRouter>
          <Header setShowRequestModal={setShowRequestModal}/>
          <Switch>

            <PrivateRoute exact path="/" render={() => (
              <div className="main-content">
                <DeliveriesPanel requests={requests} myRequests={myRequests} myTasks={myTasks} scrollToEntry={scrollToEntry}/>
                <MapImage requests={requests} scrollToId={scrollToId}/>
              </div>)
            }/>
            <Route exact path="/login" render={() => (<Login/>)}/>
            <Route exact path="/chat" render={() => (<Chat/>)}/>
          </Switch>
        </BrowserRouter>  
      </AuthProvider>  
    </div>
  );
}

export default App;
