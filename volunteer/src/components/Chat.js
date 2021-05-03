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

		let myChats_query = firebase.firestore().collection('users').doc('firebaseId').collection('my_chats');
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

	const setCurrentEntry = (entryId) => {

		setShowChat([false]);

		chatGroups.forEach((entry)=>{
			if(entry.entryId===entryId)
			{
				console.log(entry);
				setCurrentChat(entry);
				setShowChat([true]);
			}
		});

	
	};

	const loadMessages = () => { 

		console.log("loading messages");
		messageRef.current = [];
		let query = firebase.firestore()
                  .collection('users').doc('firebaseId').collection("my_chats").doc(currentChat.entryId).collection('messages').orderBy('timestamp', 'desc').limit(20);
              

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
					setFirestoreSnapshot(copyArr);
					messageRef.current = copyArr;
			      }
			    });
        	}	
	  	});
	};

	const saveMessage = (e) => {
		if(e.key=="Enter")
		{
			let message = document.querySelector(".chat-text-bar");
			firebase.firestore().collection("users").doc("firebaseId").collection("my_chats").doc(currentChat.entryId).collection('messages').add({
				recipient: "volunteer_firebaseId",
				sender:"firebaseId",
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
		console.log(chat_window.scrollHeight);
		chat_window.scrollTop = (chat_window.getBoundingClientRect().height);

	};

	useEffect(()=>{
		initPanel();
	},[]);

	useEffect(()=>{

		console.log("how manty");
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

	},[firestoreSnapshot]);

	return (

		<div className="Chat">
			<div className="chat-panel">
				<div className="chat-panel-header">Chats</div>
				<div className="chat-groups">
				{chatGroups.map((chatGroup) => {
					return (
						<div className="entry" key={chatGroup.entryId} id={chatGroup.entryId} onClick={()=>{setCurrentEntry(chatGroup.entryId)}}>
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

							return (
								<div className="chat-message-row" key={uniqid()}>
									<div className="chat-message me">{msg.text}</div>
								</div>
							)
						}):null}	
					</div>
					<input className="chat-text-bar" onKeyDown={(e)=>saveMessage(e)}></input>
				</div>
				: null}
		</div>
	);
};

export default Chat;