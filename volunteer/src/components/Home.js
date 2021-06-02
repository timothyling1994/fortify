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

  useEffect(()=>{

  	setCurrentUser(props.user);

  },[]);

  useEffect(()=>{

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