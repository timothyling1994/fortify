import React from "react";
import {useState,useEffect} from "react";
import uniqid from "uniqid";
import EntryModal from "./EntryModal.js"

function DeliveriesPanel () {

	let requestObj1 = {

		entryId: uniqid(),
		taskName: "Pick up medicine from pharmacy",
		additionalDetails: "I have auto-immune disease, please leave outside door",
		location: "415 Hayes Street San Francisco, CA 94104",
		requesterId: "456",
		volunteerId: "999",
		date_posted: "4/12/2021",
		volunteer_date: "4/14/2021",
		volunteer_time: "4:00 pm"

	};

	let requestObj2 = {

		entryId: uniqid(),
		taskName: "Pick up vaccines from pharmacy",
		additionalDetails: "I have auto-immune disease, please leave outside door",
		location: "415 Hayes Street San Francisco, CA 94104",
		requesterId: "456",
		volunteerId: "999",
		date_posted: "4/12/2021",
		volunteer_date: "4/14/2021",
		volunteer_time: "4:00 pm"

	};

	const [showDeliveryRequests,setShowDeliveryRequests] = useState(true);
	const [deliveryRequests, setDeliveryRequests] = useState([requestObj1,requestObj2]);
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
			{displayEntryModal ? <EntryModal deliveryRequests={deliveryRequests} currentEntryId={currentEntryId} closeEntryModal={closeEntryModal}/> : null}
			<div className="delivery-btn-container">
				<div className={requestAttributes.join(" ")} onClick={()=>{toggleDeliveryDisplay(true)}}>Task Requests</div>
				<div className={myDeliveriesAttributes.join(" ")} onClick={()=>{toggleDeliveryDisplay(false)}}>My Tasks</div>
			</div>
			<div className="delivery-details">
				{showDeliveryRequests ? deliveryRequests.map((entry)=>{
					return (
						<div className="entry" key={entry.entryId} onClick={()=>{openEntryModal(entry.entryId)}}>
							<div className="entry-taskName">{entry.taskName}</div>
							<div className="entry-location">{entry.location}</div>
							<div className="entry-date-container">
								<div className="entry-date-posted">posted: {entry.date_posted}</div>
								<div className="entry-volunteer-date"> date: {entry.volunteer_date} {entry.volunteer_time}</div>
							</div>
						</div>
					)
				}) : null}
			</div>

		</div>
	)
};

export default DeliveriesPanel; 