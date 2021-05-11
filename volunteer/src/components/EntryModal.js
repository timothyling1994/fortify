import firebase from "firebase";
import { withRouter } from "react-router-dom";


function EntryModal (props) {

	let location = "";
	let posted_date = "";
	let volunteer_date = "";
	let taskName="";
	let posterId="";
	let entryId="";

	const initValues = () => {
		for(let i =0; i< props.requests.length;i++)
		{
			if(props.requests[i].entryId === props.currentEntryId)
			{
				location = props.requests[i].location;
				posted_date = props.requests[i].posted_date;
				volunteer_date = props.requests[i].date;
				taskName=props.requests[i].taskName;
				posterId=props.requests[i].posterId;
				entryId = props.requests[i].entryId;
			}
		}
	};

	const closeEntryModal = () => {
		props.closeEntryModal();
	};

	const acceptEntry = () => {

		firebase.firestore().collection('requests').doc(props.currentEntryId).update({
			
			volunteerId:props.currentUser.token,

		}).then(()=>{
			console.log("Document successfully updated.");
		}).catch((error)=>{
			console.error("Error updating document: ", error);
		});

		firebase.firestore().collection('users').doc(props.currentUser.token).collection('my_tasks').doc().set({
			
			requestId: props.currentEntryId,

		});

		closeEntryModal();

	};
	const addChat = () =>{
		firebase.firestore().collection('users').doc(props.currentUser.token).collection('my_chats').doc(entryId).set({
			posterId: posterId,
			volunteerId:props.currentUser.token,
		});

		firebase.firestore().collection('users').doc(posterId).collection('my_chats').doc(entryId).set({
			posterId: posterId,
			volunteerId:props.currentUser.token,
		});

		props.history.push("/chat");
	};

	initValues();
	

	return (
		<div className="EntryModal">
			<div className="modal-container">
				<div className="modal-taskName">{taskName}</div>
				<div className="modal-location">{location}</div>
				<div className="modal-date-container">
					<div className="modal-date-posted">posted: {posted_date}</div>
					<div className="modal-volunteer-date"> date: {volunteer_date}</div>
				</div>
				<div className="modal-btn-container">
					<div className="modal-submit-btn" onClick={acceptEntry}>I Volunteer</div>
					<div className="modal-chat-btn" onClick={addChat}>Chat with Organizer</div>
					<div className="modal-cancel-btn" onClick={closeEntryModal}>Cancel</div>
				</div>
			</div>
		</div>
	);
};

export default withRouter(EntryModal); 