import React from "react";
import MapImage from "./MapImage.js";
import DeliveriesPanel from "./DeliveriesPanel.js";
import {useState,useEffect,useContext} from "react";
import { AuthContext } from "../auth.js";
import firebase from "firebase";

function Home (props){

	const [currentUser, setCurrentUser] = useState(null);
	const [requests, setRequests] = useState([]);
  	const [myRequests,setMyRequests] = useState([]);
  	const [myTasks,setMyTasks] = useState([]);
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
	      console.log("all requests");
	      console.log(requestObjArr);
	    });

	    let myRequests_query = firebase.firestore().collection('users').doc(currentUser.currentUser.uid).collection('my_requests');
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
	      console.log("my requests");
	      console.log(myRequestsObjArr);
	    });

	    let myTasks_query = firebase.firestore().collection('users').doc(currentUser.currentUser.uid).collection('my_tasks');
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
	      console.log("my tasks");
	      console.log(myTasksObjArr);
	    });
	  
  };

  useEffect(()=>{

  	console.log(props.user);
  	if(props.user !== null) 
  	{
  		setCurrentUser(props.user);
  	}

  },[props.user]);

  useEffect(()=>{

  	console.log("CURRENT USER USE EFFECT");
  	console.log(currentUser);
  	if(currentUser !== null)
  	{
  		console.log("calling firestore");
  		callFirestore();
  	}

  },[currentUser]);


	return (
		<div className="Home">
	        <DeliveriesPanel currentUser={props.user} requests={requests} myRequests={myRequests} myTasks={myTasks} scrollToEntry={scrollToEntry}/>
	        <MapImage requests={requests} setScrollToEntry={setScrollToEntry}/>
	    </div>
	);
};

export default Home;