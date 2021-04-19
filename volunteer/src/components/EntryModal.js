import react from "react";


function EntryModal (props) {

	let location = "";
	let posted_date = "";
	let volunteer_date = "";
	let volunteer_time = "";
	let taskName="";

	const initValues = () => {
		for(let i =0; i< props.requests.length;i++)
		{
			if(props.requests[i].entryId == props.currentEntryId)
			{
				location = props.requests[i].location;
				posted_date = props.requests[i].posted_date;
				volunteer_date = props.requests[i].date;
				volunteer_time = props.requests[i].volunteer_time;
				taskName=props.requests[i].taskName;
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
					<div className="modal-date-posted">posted: {posted_date}</div>
					<div className="modal-volunteer-date"> date: {volunteer_date}</div>
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