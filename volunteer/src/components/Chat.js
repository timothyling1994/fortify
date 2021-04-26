import React from "react";
import {useState,useEffect,useRef} from "react";
import firebase from "firebase";
import uniqid from "uniqid";

const Chat = (props) => {

	const [chatGroups, setChatGroups] = useState([]);
	const [showChat,setShowChat]=useState(false);
	const [currentChat,setCurrentChat]=useState({});

	const chatGroupRef = useRef([]);

	const initPanel = () => {

		let myChats_query = firebase.firestore().collection('users').doc('firebaseId').collection('my_chats');
		myChats_query.onSnapshot((snapshot)=>{
			
			snapshot.forEach((doc)=>{
			
					let requestId = doc.id;
				
					firebase.firestore().collection('requests').doc(requestId).get().then((doc)=>
					{
					  //console.log(doc.data());
					  if(doc.exists)
					  {
					  	//console.log(doc.data());
					    let requestObj = {...doc.data()};
					    requestObj.entryId = requestId;
					    //console.log("chatGroups");
					    //console.log(chatGroups);
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

		chatGroups.forEach((entry)=>{
			if(entry.entryId==entryId)
			{
				setCurrentChat(entry);
			}
		});

		setShowChat(true);
	};

	const loadMessages = () => { 
		console.log(currentChat.entryId);
		let query = firebase.firestore()
                  .collection('users').doc('firebaseId').collection("my_chats").doc("GTSEdZdm17XuMQJtPRf5").collection('messages').limit(12);
                  //.orderBy('timestamp', 'desc')

        query.onSnapshot(function(snapshot) {
		    snapshot.docChanges().forEach(function(change) {

		      if (change.type === 'removed') {
		      } else {
		       	let message = change.doc.data();
		        console.log(message);
		      
		      }
		    });
	  	});
	};

	useEffect(()=>{
		initPanel();
	},[]);

	useEffect(()=>{
		if(showChat)
		{
			console.log("reach");
			loadMessages();
		}
	},[showChat]);

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
						</div>)
				})}
				</div>
			</div>

			{showChat ? 
				<div className="chat-window">
					<div className="chat-window-top-bar">
						<div className="chat-window-top-bar-user">{currentChat.entryId}</div>
						<div className="chat-window-top-bar-pic"></div>
					</div>
					<div className="chat-window-messages">
					</div>
				</div>
				: null

			}
		</div>
	);
};

export default Chat;