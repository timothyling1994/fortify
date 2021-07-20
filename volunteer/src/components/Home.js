import React from "react";
import MapImage from "./MapImage.js";
import TaskPanel from "./TaskPanel.js";
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
	    	console.log("SNAPPED1");
	      let requestObjArr = [];
	      snapshot.forEach((doc)=>{
	        let requestObj = doc.data();
	        requestObj.entryId = doc.id;
	        requestObjArr.push(requestObj);
	      });
	      setRequests(requestObjArr); 
	    });


	    let myRequests_query = firebase.firestore().collection('users').doc(currentUser.currentUser.uid).collection('my_requests');
	    myRequests_query.onSnapshot((snapshot)=>{
	    	console.log("SNAPPED2");
	      let myRequestsObjArr = [];
	      snapshot.forEach((doc)=>{
	      	
	  	
	        //console.log(doc.data().requestsRef);
	       	//console.log(data.requestsRef.path);

	       let requestId = doc.data().requestId;
	       let docRef = firebase.firestore().collection('requests').doc(requestId);
	       docRef.get().then((docSnapshot)=>{
	       	if(docSnapshot.exists)
	       	{	
	       		console.log("snapshot changed1");
	       		docRef.onSnapshot((doc)=>{
	       			console.log("snapshot changed2");
	       			console.log(myRequestsObjArr);
	       			let requestObj = doc.data();
	       			let existingRequest = false;
	       			let existingIndex = -1;

	       			for(let i = 0; i< myRequestsObjArr.length;i++)
	       			{
	       				if(myRequestsObjArr[i].entryId == requestId)
	       				{
	       					existingRequest = true;
	       					existingIndex = i;
	       				}
	       			}

	       			requestObj.entryId = requestId;

	       			if(existingRequest)
	       			{	
	       				myRequestsObjArr[existingIndex] = requestObj
	       			}
	       			else
	       			{
	       				myRequestsObjArr.push(requestObj);
	       			}
	       		
	       		});
	       	}
	       });
	      });
	      setMyRequests(myRequestsObjArr);
	    });

	    let myTasks_query = firebase.firestore().collection('users').doc(currentUser.currentUser.uid).collection('my_tasks');
	    myTasks_query.onSnapshot((snapshot)=>{
	    	console.log("SNAPPED3");
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

  	if(props.user !== null) 
  	{
  		setCurrentUser(props.user);
  	}

  },[props.user]);

  useEffect(()=>{

  	if(currentUser !== null)
  	{
  		console.log("calling firestore");
  		callFirestore();
  	}

  },[currentUser]);


	return (
		<div className="Home">
	        <TaskPanel currentUser={currentUser} requests={requests} myRequests={myRequests} myTasks={myTasks} scrollToEntry={scrollToEntry}/>
	        <MapImage requests={requests} setScrollToEntry={setScrollToEntry}/>
	    </div>
	);
};

export default Home;