import React from "react";
import {useState,useEffect} from "react";
import uniqid from "uniqid";
import EntryModal from "./EntryModal.js"
import firebase from "firebase";

function DeliveriesPanel (props) {

	const [showDeliveryRequests,setShowDeliveryRequests] = useState(true);
	const [myDeliveries, setMyDeliveries] = useState([]);
	const [requestAttributes,setRequestAttributes] = useState(["delivery-requests-label"]);
	const [myDeliveriesAttributes,setMyDeliveriesAttributes] = useState(["my-deliveries-label"]);
	const [displayEntryModal,setDisplayEntryModal] = useState(false);
	const [currentEntryId,setCurrentEntryId] = useState("");

	const toggleDeliveryDisplay = (value) => {
		setShowDeliveryRequests(value);
	};

	const highlightDiv = () => {

		if(showDeliveryRequests)
		{
			setRequestAttributes(["delivery-requests-label","highlight"]);
			setMyDeliveriesAttributes(["my-deliveries-label"]);
		}
		else
		{
			setRequestAttributes(["delivery-requests-label"]);
			setMyDeliveriesAttributes(["my-deliveries-label","highlight"]);
		}
	};

	useEffect(()=>{
		highlightDiv();
	},[showDeliveryRequests]);


	const openEntryModal = (entryId) => {
		setCurrentEntryId(entryId);
		setDisplayEntryModal(true);
	};	

	const closeEntryModal = () => {
		setDisplayEntryModal(false);
	};	

	return (
		<div className="DeliveriesPanel">
			{displayEntryModal ? <EntryModal requests={props.requests} currentEntryId={currentEntryId} closeEntryModal={closeEntryModal}/> : null}
			<div className="delivery-btn-container">
				<div className={requestAttributes.join(" ")} onClick={()=>{toggleDeliveryDisplay(true)}}>Task Requests</div>
				<div className={myDeliveriesAttributes.join(" ")} onClick={()=>{toggleDeliveryDisplay(false)}}>My Tasks</div>
			</div>
			<div className="delivery-details">
				{showDeliveryRequests ? props.requests.map((entry)=>{
					return (
						<div className="entry" key={uniqid()} onClick={()=>{openEntryModal(entry.entryId)}}>
							<div className="entry-taskName-container">
								<div className="entry-taskName">{entry.taskName}</div>
							</div>
							<div className="entry-location">{entry.location}</div>
							<div className="entry-date-container">
								<div className="entry-date-posted">posted: {entry.posted_date}</div>
								<div className="entry-volunteer-date"> date: {entry.date}</div>
							</div>
						</div>
					)
				}) : null}
			</div>

		</div>
	)
};

export default DeliveriesPanel; 