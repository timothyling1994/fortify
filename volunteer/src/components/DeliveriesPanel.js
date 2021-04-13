import React from "react";
import {useState} from "react";

function DeliveriesPanel () {

	let requestObj = {

		entryId: "123",
		taskName: "Pick up medicine from pharmacy",
		additionalDetails: "I have auto-immune disease, please leave outside door",
		location: "415 Hayes Street San Francisco, CA 94104",
		requesterId: "456",
		volunteerId: "999",
		date_created: "4/12/2021",
		volunteer_date: "4/14/2021",
		volunteer_time: "4:00 pm"

	};

	const [deliveryRequests, setDeliveryRequests] = useState([requestObj,requestObj,requestObj,requestObj,requestObj,requestObj,requestObj]);
	const [myDeliveries, setMyDeliveries] = useState([]);

	const [showDeliveryRequests,setShowDeliveryRequests] = useState(true);

	const toggleDeliveryDisplay = () => {
		setShowDeliveryRequests((prev)=>{return !prev});
	};

	return (
		<div className="DeliveriesPanel">
			<div className="delivery-btn-container">
				<div className="delivery-requests-label" onClick={toggleDeliveryDisplay}>Delivery Requests</div>
				<div className="my-deliveries-label" onClick={toggleDeliveryDisplay}>My Deliveries</div>
			</div>
			<div className="delivery-details">
				{showDeliveryRequests ? deliveryRequests.map((entry)=>{
					return (
						<div className="entry">
							<div className="entry-taskName">{entry.taskName}</div>
							<div className="entry-location">{entry.location}</div>
							<div className="entry-date-container">
								<div className="entry-date-created">created: {entry.date_created}</div>
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