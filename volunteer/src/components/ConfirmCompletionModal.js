import React,{useState} from "react";
import firebase from "firebase";
import Paypal from "./Paypal.js";

const ConfirmCompletionModal = (props) => {

	//const [isDonating,setIsDonating] = useState(false);

	const completeTask = () => { 

		firebase.firestore().collection('requests').doc(props.currentTaskCompletedEntry.entryId).update({
			completed: true,
		});

		props.setDisplayCompletionModal(false)
	};	

	return (
	
		<div className="ConfirmCompletionModal">
			<div className="ConfirmCompletionContainer">
				<div className="confirm-header">Confirm the completion of this task</div>
				<div className="modal-taskName">{props.currentTaskCompletedEntry.taskName}</div>
				<div className="modal-location">{props.currentTaskCompletedEntry.location}</div>
				<div className="charity-container">
					{
						props.currentTaskCompletedEntry.isDonating ? 
							<div>
								<div className="modal-donation-amount">${props.currentTaskCompletedEntry.donation}</div>
								<Paypal currentUser={props.currentUser} currentTask = {props.currentTaskCompletedEntry.entryId} donationAmount={props.currentTaskCompletedEntry.donation} setDisplayCompletionModal={props.setDisplayCompletionModal}/>
							</div>
							: null
					}
				</div>
				<div className="confirm-btn-row">
					{props.currentTaskCompletedEntry.isDonating ? null : <div className="confirm-completion-btn" onClick={()=>{completeTask()}}>Confirm</div>}
					<div className="cancel-completion-btn" onClick={()=>{props.setDisplayCompletionModal(false)}}>Cancel</div>
				</div>

			</div>
		</div>
	);
};

export default ConfirmCompletionModal;