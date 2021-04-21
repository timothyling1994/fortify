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
	const [requests,setRequests] = useState([]);
	const [toggleSortByDate,setToggleSortByDate] = useState(false);
	const [toggleSortByVolunteerDate,setToggleSortByVolunteerDate] = useState(false);
	const [toggleCategoryFilter,setToggleCategoryFilter] = useState(false);

	const dropDownStyle = {
	};

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

	const openEntryModal = (entryId) => {
		setCurrentEntryId(entryId);
		setDisplayEntryModal(true);
	};	

	const closeEntryModal = () => {
		setDisplayEntryModal(false);
	};

	const setScrollPosition = () => {
		
		const panel = document.querySelector(".DeliveriesPanel");
		const panelEntryId = props.scrollToEntry[0].substring(7,);
		const entryDiv = document.getElementById(panelEntryId);

		panel.scrollTop = entryDiv.offsetTop-(entryDiv.offsetHeight);

		entryDiv.classList.add("temp-highlight");
		setTimeout(function(){
			entryDiv.classList.remove("temp-highlight")
		},1000);
	};

	//sorting array uses same array reference, which doesn't cause react re-render. You need to use spread operator to create new reference

	const sortByDate = () => {

		if(props.requests.length !== 0)
		{
			if(toggleSortByDate)
			{
				let arr = props.requests;
				const sortedRequests = [...arr].sort((a,b)=> new Date(b.posted_date) - new Date(a.posted_date));
				setRequests(sortedRequests);
				setToggleSortByDate((prev)=> !prev);
			}
			else
			{
				let arr = props.requests;
				const sortedRequests = [...arr].sort((a,b)=> new Date(a.posted_date) - new Date(b.posted_date));
				setRequests(sortedRequests);
				setToggleSortByDate((prev)=> !prev);
			}
		}
	};

	const sortByVolunteerDate = () => {
		if(props.requests.length !== 0)
		{
			if(toggleSortByVolunteerDate)
			{
				let arr = props.requests;
				const sortedRequests = [...arr].sort((a,b)=> new Date(b.date) - new Date(a.date));
				setRequests(sortedRequests);
				setToggleSortByVolunteerDate((prev)=> !prev);
			}
			else
			{
				let arr = props.requests;
				const sortedRequests = [...arr].sort((a,b)=> new Date(a.date) - new Date(b.date));
				setRequests(sortedRequests);
				setToggleSortByVolunteerDate((prev)=> !prev);
			}
		}
	};

	const showCategoryDropDown = () => {
		console.log("THIS");
		if(!toggleCategoryFilter)
		{
			const el = document.querySelector(".category-filter-dropdown");
			el.style.display="block";
			setToggleCategoryFilter((prev)=>!prev);
		}
		else
		{
			const el = document.querySelector(".category-filter-dropdown");
			el.style.display="none";
			setToggleCategoryFilter((prev)=>!prev);
		}
	
	};

	const filterCategory = (category) => {
		console.log(category);
		switch(category){
			case 'Groceries':
				console.log("reached");
				if(props.requests.length !== 0)
				{
					let arr = props.requests;
					const filteredRequests = [...arr].filter(request=>request.category == category);
					setRequests(filteredRequests);	
				}

				break;
			case 'Medicine':
				break;
			case 'Dog Walking':
				break;
			case 'Transportation':
				break;
			case 'Assembly':
				break;
			default :
				break;
		}
	};

	useEffect(()=>{
		highlightDiv();
	},[showDeliveryRequests]);

	useEffect(()=>{
		if(props.scrollToEntry.length !== 0)
		{
			setScrollPosition();
		}
	},[props.scrollToEntry]);


	useEffect(()=>{

		if(props.requests.length !== 0)
		{
			let arr = props.requests;
			const sortedRequests = arr.sort((a,b)=> new Date(b.posted_date) - new Date(a.posted_date));
			setRequests(sortedRequests);
		}

	},[props.requests]);


/*							<label className="category dog-walking-category" onClick={()=>{filterCategory("Dog Walking")}}>Dog Walking</div>
							<div className="category transportation-category" onClick={()=>{filterCategory("Transportation")}}>Transportation</div>
							<div className="category assembly-category" onClick={()=>{filterCategory("Assembly")}}>Assembly</div>
							<div className="category other-category" onClick={()=>{filterCategory("Other")}}>Other</div>*/

	return (
		<div className="DeliveriesPanel">
			{displayEntryModal ? <EntryModal requests={props.requests} currentEntryId={currentEntryId} closeEntryModal={closeEntryModal}/> : null}
			<div className="delivery-btn-container">
				<div className={requestAttributes.join(" ")} onClick={()=>{toggleDeliveryDisplay(true)}}>Task Requests</div>
				<div className={myDeliveriesAttributes.join(" ")} onClick={()=>{toggleDeliveryDisplay(false)}}>My Tasks</div>
			</div>
			<div className="delivery-filter-row">
					<div className="filter-options" onClick={sortByDate}>Sort by Date Posted</div>
					<div className="filter-options" onClick={sortByVolunteerDate}>Sort by Volunteer Date</div>	
					<div className="filter-options category-filter" onClick={showCategoryDropDown}>Filter by Category</div>	
			</div>
			<div className="delivery-details">
				{showDeliveryRequests ? requests.map((entry)=>{
					return (
						<div className="entry" key={entry.entryId} id={entry.entryId} onClick={()=>{openEntryModal(entry.entryId)}}>
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