import react from "react";


function EntryModal (props) {

	let location = "";
	let date_posted = "";
	let volunteer_date = "";
	let volunteer_time = "";
	let taskName="";

	const initValues = () => {
		for(let i =0; i< props.deliveryRequests.length;i++)
		{
			if(props.deliveryRequests[i].entryId == props.currentEntryId)
			{
				location = props.deliveryRequests[i].location;
				date_posted = props.deliveryRequests[i].date_posted;
				volunteer_date = props.deliveryRequests[i].volunteer_date;
				volunteer_time = props.deliveryRequests[i].volunteer_time;
				taskName=props.deliveryRequests[i].taskName;
			}
		}
	};

	const closeEntryModal = () => {
		props.closeEntryModal();
	};

	initValues();
	

	return (
		<div className="EntryModal">
			<div className="modal-container">
				<div className="modal-taskName">{taskName}</div>
				<div className="modal-location">{location}</div>
				<div className="modal-date-container">
					<div className="modal-date-posted">posted: {date_posted}</div>
					<div className="modal-volunteer-date"> date: {volunteer_date} {volunteer_time}</div>
				</div>
				<div className="modal-btn-container">
					<div className="modal-submit-btn">I Volunteer</div>
					<div className="modal-cancel-btn" onClick={closeEntryModal}>Cancel</div>
				</div>
			</div>
		</div>
	);
};

export default EntryModal; 