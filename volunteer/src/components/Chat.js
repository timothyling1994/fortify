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
	const [componentMounted, setComponentMounted] = useState(false);

	const chatGroupRef = useRef([]);
	const messageRef = useRef([]);

	const initPanel = () => {

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

		setShowChat([false]);
		removeHighlight();
		highlightDiv(event);

		chatGroups.forEach((entry)=>{
			if(entry.entryId===entryId)
			{
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

				console.log("query changed");

				messageRef.current = [];
				let messageObjArr = [];


				const getAllChatGroups = await Promise.all(snapshot.docs.map(async doc => {

					let msgQuery = doc.ref.collection('messages').orderBy('timestamp', 'desc');
					
					let msgQueryResult = await new Promise((resolve,reject)=>{
						
						msgQuery.onSnapshot(async (msgSnapshot)=>{

							console.log("msgQuery changed");
							let messageObj = {};
							let chatGroupId = "";

							const allMsgs = msgSnapshot.docs.map(async msgDoc => {
		
								if(messageObj[msgDoc.ref.parent.parent.id])
								{
									messageObj[msgDoc.ref.parent.parent.id].push(msgDoc.data());
								}
								else
								{	
									messageObj[msgDoc.ref.parent.parent.id] = [msgDoc.data()];
								}
								chatGroupId = msgDoc.ref.parent.parent.id;

								resolve(2);
							});

							let copyArr = [...messageRef.current];

							console.log(chatGroupId);
							console.log(copyArr);

							let found = false; 

							for(let i = 0;i<copyArr.length;i++)
							{
								if(copyArr[i][chatGroupId])
								{
									found=true;
									console.log("found");
									copyArr[i] = messageObj;
								}
							}

							if(!found)
							{
								copyArr.push(messageObj);
							}


							messageRef.current = copyArr;
							
							console.log(componentMounted);
							//if(componentMounted)
							{
								setFirestoreSnapshot([...messageRef.current]);
							}

						});

					});

					console.log(msgQueryResult);
			
					return Promise.resolve(1);
				}));

				resolve(getAllChatGroups);
			});

		});
        
	};

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

			if(message.value !== "")
			{
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
			}

			message.value = "";
		}
	};

	const setScrollHeight = () => {
		const chat_window = document.querySelector(".chat-window-messages");
		
		if(chat_window !== null) {
			chat_window.scrollTop = (chat_window.getBoundingClientRect().height);
		}

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
		setComponentMounted(true);

		return () => {
			setComponentMounted(false);
		};
	},[]);

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
			let found = false;
			firestoreSnapshot.forEach((obj)=>{
				if(obj[currentChat.entryId])
				{
					obj[currentChat.entryId].sort((a,b)=>{
			
						return (a.timestamp - b.timestamp);
					});

					setCurrentChatMessages(obj[currentChat.entryId]);
					setScrollHeight();
					found = true;
				}
			});

			if(!found)
			{
				setCurrentChatMessages([]);
			}
		}
	},[showChat]);

	useEffect(()=>{


		if(firestoreSnapshot.length !== 0)
		{
			firestoreSnapshot.forEach((obj)=>{
				if(obj[currentChat.entryId])
				{
					obj[currentChat.entryId].sort((a,b)=>{
						return (a.timestamp - b.timestamp);
					});

					setCurrentChatMessages(obj[currentChat.entryId]);
					setScrollHeight();
				}
			});
			
		}

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