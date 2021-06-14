import React,{useState} from "react";
import firebase from "firebase";
import Paypal from "./Paypal.js";

const ConfirmCompletionModal = (props) => {

	const [isDonating,setIsDonating] = useState(true);

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
				<div className="modal-donation-amount">${props.currentTaskCompletedEntry.donation}</div>
				<div className="charity-container">
					{
						isDonating ? <Paypal donationAmount={props.currentTaskCompletedEntry.donation}/>
							
							: null
					}
				</div>
				<div className="confirm-btn-row">
					<div className="confirm-completion-btn" onClick={()=>{completeTask()}}>Confirm</div>
					<div className="cancel-completion-btn" onClick={()=>{props.setDisplayCompletionModal(false)}}>Cancel</div>
				</div>

			</div>
		</div>
	);
};

export default ConfirmCompletionModal;