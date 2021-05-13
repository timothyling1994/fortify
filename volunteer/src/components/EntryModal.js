import firebase from "firebase";
import { withRouter } from "react-router-dom";
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function EntryModal (props) {

	let location = "";
	let posted_date = "";
	let volunteer_date = "";
	let taskName="";
	let posterId="";
	let entryId="";
	let volunteers_accepted = 0;
	let volunteers_needed = 0;
	let entry_status="";
	let volunteersArr = [];

	const invalid_form = (message) => toast.error(message, {
		position: "top-right",
		autoClose: 3000,
		hideProgressBar: false,
		closeOnClick: true,
		draggable: true,
		progress: undefined,
	});

	let styles = {
		fontSize: '20px',
		fontFamily: 'Noto Sans, sans-serif',
	}

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
				volunteers_accepted = props.requests[i].volunteers_accepted;
				volunteers_needed = props.requests[i].volunteers_needed;
				entry_status = props.requests[i].status;
				volunteersArr = [...props.requests[i].volunteerId];
			}
		}
	};

	const closeEntryModal = () => {
		props.closeEntryModal();
	};

//have to group volunteerIds for multiple volunteers

	const acceptEntry = () => {

		let status = "";

		if(entry_status === "accepted")
		{
			invalid_form('All volunteer spots have been already filled!');
		}
		else if(volunteersArr.includes(props.currentUser.token))
		{
			invalid_form('You already accepted this task!');
		}
		else
		{
			if(volunteers_accepted+1 === volunteers_needed)
			{
				status="accepted";
			}
			else
			{
				status="pending";
			}

			let temp = [...volunteersArr];
			temp.push(props.currentUser.token);

			firebase.firestore().collection('requests').doc(props.currentEntryId).update({
				
				status:status,
				volunteers_accepted: volunteers_accepted + 1,
				volunteerId:temp,

			}).then(()=>{
				console.log("Document successfully updated.");
			}).catch((error)=>{
				console.error("Error updating document: ", error);
			});

			firebase.firestore().collection('users').doc(props.currentUser.token).collection('my_tasks').doc().set({
				
				requestId: props.currentEntryId,

			});

			closeEntryModal();
		}

	

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
			<ToastContainer style={styles}/>
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