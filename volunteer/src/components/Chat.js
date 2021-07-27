import React from "react";
import {useState,useEffect,useRef} from "react";
import firebase from "firebase";
import uniqid from "uniqid";
var async = require("async");

const Chat = (props) => {

	const [chatGroups, setChatGroups] = useState([]);
	const [showChat,setShowChat]=useState([false]);
	const [currentChat,setCurrentChat]=useState({});
	const [currentChatMessages,setCurrentChatMessages] = useState([]);
	const [firestoreSnapshot,setFirestoreSnapshot] = useState([]);

	const chatGroupRef = useRef([]);
	const messageRef = useRef([]);

	const initPanel = () => {

		//chatGroupRef.current = [];

		let myChats_query = firebase.firestore().collection('users').doc(props.user.currentUser.uid).collection('my_chats');
		myChats_query.onSnapshot((snapshot)=>{
			
			chatGroupRef.current = [];

			snapshot.forEach((doc)=>{
			
					let requestId = doc.id;
				
					firebase.firestore().collection('requests').doc(requestId).get().then((doc)=>
					{

					  if(doc.exists)
					  {
					    let requestObj = {...doc.data()};
					    requestObj.entryId = requestId;
					    let newRequestArr = [...chatGroupRef.current];
					    newRequestArr.push(requestObj);
					    setChatGroups(newRequestArr);
					    chatGroupRef.current = newRequestArr;
					  }
					});
			});
		});
	};

	const setCurrentEntry = (event, entryId) => {

		//console.log(event);

		setShowChat([false]);
		removeHighlight();
		highlightDiv(event);

		chatGroups.forEach((entry)=>{
			if(entry.entryId===entryId)
			{
				//console.log(entry);
				firebase.firestore().collection("users").doc(props.user.currentUser.uid).collection("my_chats").doc(entry.entryId).get().then((doc)=>{
					if(doc.exists){
						//let posterId = doc.data().posterId;
						let volunteerId = doc.data().volunteerId;
						entry.volunteerId = volunteerId;
						setCurrentChat(entry);
						setShowChat([true]);
					}
					else
					{
						console.log("No such document!");
					}
				});
				
			}
		});

	};

	const loadMessages = async () => { 

		let query = firebase.firestore().collection('users').doc(props.user.currentUser.uid).collection("my_chats");
		

		let result = await new Promise ((resolve,reject) => {

			query.onSnapshot(async(snapshot)=>{

				messageRef.current = [];
				let messageObjArr = [];

				const getAllChatGroups = await Promise.all(snapshot.docs.map(async doc => {
					
					console.log("1");

					let msgQuery = doc.ref.collection('messages');
					
					let msgQueryResult = await new Promise((resolve,reject)=>{
						
						msgQuery.onSnapshot(async (msgSnapshot)=>{
							
							let messageObj = {};

							const allMsgs = msgSnapshot.docs.map(async msgDoc => {
								console.log("3");
								if(messageObj[msgDoc.ref.parent.parent.id])
								{
									messageObj[msgDoc.ref.parent.parent.id].push(msgDoc.data());
								}
								else
								{	
									messageObj[msgDoc.ref.parent.parent.id] = [msgDoc.data()];
								}

								resolve(2);
							});

							let copyArr = [...messageRef.current];
							copyArr.push(messageObj);
							messageRef.current = copyArr;
							setFirestoreSnapshot([...messageRef.current]);
						});

					});

					console.log(msgQueryResult);
			
					return Promise.resolve(1);
				}));

				console.log(getAllChatGroups);

				resolve(getAllChatGroups);
			});

		});
		console.log(result);
        
	};

	/*
			snapshot.docs.forEach(function(doc){
				console.log(doc);
				//let entryId = doc.id;
				let msgQuery = doc.ref.collection('messages');
				
				
				msgQuery.onSnapshot(function(msgSnapshot){
					let messageObj = {};

					msgSnapshot.docs.forEach(function(msgDoc){
						if(messageObj[msgDoc.ref.parent.parent.id])
						{
							messageObj[msgDoc.ref.parent.parent.id].push(msgDoc.data());
						}
						else
						{
							messageObj[msgDoc.ref.parent.parent.id] = [msgDoc.data()];
						}
					});
					console.log(messageObj);
					let copyArr = [...messageRef.current];
					copyArr.push(messageObj);
					messageRef.current = copyArr;
					console.log(messageRef.current);

				});
				
			});*/

	/*const loadMessages = () => { 

		messageRef.current = [];
		
		let query = firebase.firestore()
                  .collection('users').doc(props.user.currentUser.uid).collection("my_chats").doc(currentChat.entryId).collection('messages').orderBy('timestamp', 'desc').limit(20);
              

        query.onSnapshot(function(snapshot) {
        	console.log("snapshot changed!!!!");
        	console.log(snapshot);
        	if(!snapshot.metadata.hasPendingWrites)
        	{

			    snapshot.docChanges().forEach(function(change) {

			    console.log("how many times");
			      if (change.type === 'removed') {
			      
			      }
			      else {

			       	let message = change.doc.data();
			       	let copyArr = [...messageRef.current];
			       	copyArr.push(message);
					//setFirestoreSnapshot(copyArr);
					messageRef.current = copyArr;
			      }
			    });
			    setFirestoreSnapshot([...messageRef.current]);
			    console.log([...messageRef.current]);
        	}	
	  	});
	};*/

	const saveMessage = (e) => {
		if(e.key=="Enter")
		{

			let message = document.querySelector(".chat-text-bar");

			let recipient = "";

			if(props.user.currentUser.uid == currentChat.posterId)
			{
				recipient = currentChat.volunteerId;
			}
			else
			{
				recipient = currentChat.posterId;
			}

			firebase.firestore().collection("users").doc(props.user.currentUser.uid).collection("my_chats").doc(currentChat.entryId).collection('messages').add({
				recipient: recipient,
				sender:props.user.currentUser.uid,
				text:message.value,
				timestamp:firebase.firestore.FieldValue.serverTimestamp()
			}).catch(function(error){
				console.error('Error writing new message to database',error);
			});


			firebase.firestore().collection("users").doc(recipient).collection("my_chats").doc(currentChat.entryId).collection('messages').add({
				recipient: recipient,
				sender:props.user.currentUser.uid,
				text:message.value,
				timestamp:firebase.firestore.FieldValue.serverTimestamp()
			}).catch(function(error){
				console.error('Error writing new message to database',error);
			});

			message.value = "";
		}
	};

	const setScrollHeight = () => {
		const chat_window = document.querySelector(".chat-window-messages");
		chat_window.scrollTop = (chat_window.getBoundingClientRect().height);

	};

	const highlightDiv = (event) => {

		event.target.closest(".entry").classList.add("highlight");
		
	};

	const removeHighlight = () => {
		const nodeList = document.querySelectorAll(".entry");
		nodeList.forEach((node)=>{
			if(node.classList.contains("highlight"))
			{
				node.classList.remove("highlight");
			}
		});
	}

	useEffect(()=>{
		if(props.user !== null)
		{
			initPanel();
			loadMessages();
		}
	
	},[props.user]);

	useEffect(()=>{

		if(showChat[0])
		{
			//loadMessages();
			setScrollHeight();
		}
	},[showChat]);

	useEffect(()=>{

		console.log("reached useeffect");

		console.log(firestoreSnapshot);

		

		/*firestoreSnapshot.sort((a,b) => { 
			return (a.timestamp - b.timestamp);
		});
		setCurrentChatMessages(firestoreSnapshot);*/
	

	},[firestoreSnapshot]);


	return (

		<div className="Chat">
			<div className="chat-panel">
				<div className="chat-panel-header">Chats</div>
				<div className="chat-groups">
				{chatGroups.map((chatGroup) => {
					return (
						<div className="entry" key={chatGroup.entryId} id={chatGroup.entryId} onClick={(e)=>{setCurrentEntry(e,chatGroup.entryId)}}>
							<div className="entry-taskName-container">
								<div className="entry-taskName">{chatGroup.taskName}</div>
							</div>
							<div className="entry-location">{chatGroup.location}</div>
							<div className="entry-date-container">
								<div className="entry-date-posted">posted: {chatGroup.posted_date}</div>
								<div className="entry-volunteer-date"> date: {chatGroup.date}</div>
							</div>
						</div>
					)
				})}
				</div>
			</div>

			{showChat[0] ? 
				<div className="chat-window">
					<div className="chat-window-top-bar">
						<div className="chat-window-top-bar-user">{currentChat.entryId}</div>
						<div className="chat-window-top-bar-pic"></div>
					</div>
					<div className="chat-window-messages">
						{currentChatMessages ? currentChatMessages.map((msg)=>{
							//let classAttributes = ["chat-message"];
							//console.log(msg);
							if(msg.sender === props.user.currentUser.uid)
							{
								return (
								<div className="chat-message-row" key={uniqid()}>
									<div className="chat-message me">{msg.text}</div>
								</div>
								)
							}
							else
							{
								return (
								<div className="chat-message-row" key={uniqid()}>
									<div className="chat-message him">{msg.text}</div>
								</div>
								)
							}
						
						}):null}	
					</div>
					<input className="chat-text-bar" onKeyDown={(e)=>saveMessage(e)}></input>
				</div>
				: null}
		</div>
	);
};

export default Chat;