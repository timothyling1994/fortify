import React from "react";
import {useState,useEffect} from "react";
import firebase from "firebase";

const Chat = (props) => {
	const [chatGroups, setChatGroups] = useState([]);

	const initPanel = () => {

		let myChats_query = firebase.firestore().collection('users').doc('firebaseId').collection('my_chats');
		myChats_query.onSnapshot((snapshot)=>{
			let myChatsObjArr = [];
			snapshot.forEach((doc)=>{
					console.log("1");
				//console.log(doc.data().entryId);
					let requestId = doc.data().entryId;
					//const doc_result = await firebase.firestore().collection('requests').doc(requestId).get();
					firebase.firestore().collection('requests').doc(requestId).get().then((doc)=>
					{
					  //console.log(doc.data());
					  if(doc.exists)
					  {
					  	console.log(doc.data());
					    let requestObj = doc.data();
					    requestObj.entryId = requestId;
					    myChatsObjArr.push(requestObj);
					    console.log(myChatsObjArr);
					  }
					});
			});
			console.log(myChatsObjArr);
			//console.log(myChatsObjArr);
			setChatGroups(myChatsObjArr); 
		});
	};

	useEffect(()=>{
		initPanel();
	},[]);

	return (

		<div className="Chat">
			<div className="chat-panel">
				<div className="chat-panel-header">Chats</div>
				{chatGroups.map((chatGroup) => {
					console.log("here");
					console.log(chatGroup);
					return <div className="entry">{chatGroup.posterId}</div>
				})}
			</div>
			<div className="chat-window"></div>
		</div>
	);
};

export default Chat;