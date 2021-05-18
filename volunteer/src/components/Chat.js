import React from "react";
import {useState,useEffect,useRef} from "react";
import firebase from "firebase";
import uniqid from "uniqid";

const Chat = (props) => {

	const [chatGroups, setChatGroups] = useState([]);
	const [showChat,setShowChat]=useState([false]);
	const [currentChat,setCurrentChat]=useState({});
	const [currentChatMessages,setCurrentChatMessages] = useState([]);
	const [firestoreSnapshot,setFirestoreSnapshot] = useState([]);

	const chatGroupRef = useRef([]);
	const messageRef = useRef([]);

	const initPanel = () => {

		chatGroupRef.current = [];

		let myChats_query = firebase.firestore().collection('users').doc(props.currentUser.token).collection('my_chats');
		myChats_query.onSnapshot((snapshot)=>{
			
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
				firebase.firestore().collection("users").doc(props.currentUser.token).collection("my_chats").doc(entry.entryId).get().then((doc)=>{
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

	const loadMessages = () => { 

		messageRef.current = [];
		//console.log("loading:"+currentChat.entryId);
		let query = firebase.firestore()
                  .collection('users').doc(props.currentUser.token).collection("my_chats").doc(currentChat.entryId).collection('messages').orderBy('timestamp', 'desc').limit(20);
              

        query.onSnapshot(function(snapshot) {
        	if(!snapshot.metadata.hasPendingWrites)
        	{

			    snapshot.docChanges().forEach(function(change) {

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
        	}	
	  	});
	};

	const saveMessage = (e) => {
		if(e.key=="Enter")
		{

			let message = document.querySelector(".chat-text-bar");

			let recipient = "";

			if(props.currentUser.token == currentChat.posterId)
			{
				recipient = currentChat.volunteerId;
			}
			else
			{
				recipient = currentChat.posterId;
			}

			firebase.firestore().collection("users").doc(props.currentUser.token).collection("my_chats").doc(currentChat.entryId).collection('messages').add({
				recipient: recipient,
				sender:props.currentUser.token,
				text:message.value,
				timestamp:firebase.firestore.FieldValue.serverTimestamp()
			}).catch(function(error){
				console.error('Error writing new message to database',error);
			});


			firebase.firestore().collection("users").doc(recipient).collection("my_chats").doc(currentChat.entryId).collection('messages').add({
				recipient: recipient,
				sender:props.currentUser.token,
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
		initPanel();
	
	},[]);

	useEffect(()=>{

		if(showChat[0])
		{
			loadMessages();
		}
	},[showChat]);

	useEffect(()=>{

		if(firestoreSnapshot.length !== 0)
		{
			firestoreSnapshot.sort((a,b) => { 
				return (a.timestamp - b.timestamp);
			});
			setCurrentChatMessages(firestoreSnapshot);
			setScrollHeight();
		}
		else
		{
			setCurrentChatMessages(firestoreSnapshot);
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
							if(msg.sender === props.currentUser.token)
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