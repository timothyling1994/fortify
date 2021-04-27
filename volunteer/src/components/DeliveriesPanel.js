import React from "react";
import {useState,useEffect} from "react";
import EntryModal from "./EntryModal.js"

function DeliveriesPanel (props) {

	const [displayPanelTab,setDisplayPanelTab] = useState(0);
	//const [myDeliveries, setMyDeliveries] = useState([]);
	const [requestAttributes,setRequestAttributes] = useState(["delivery-requests-label"]);
	const [myDeliveriesAttributes,setMyDeliveriesAttributes] = useState(["my-deliveries-label"]);
	const [myTasksAttributes,setMyTasksAttribute] = useState(["my-tasks-label"]);
	const [displayEntryModal,setDisplayEntryModal] = useState(false);
	const [currentEntryId,setCurrentEntryId] = useState("");
	const [requests,setRequests] = useState([]);
	const [toggleSortByDate,setToggleSortByDate] = useState(false);
	const [toggleSortByVolunteerDate,setToggleSortByVolunteerDate] = useState(true);

	const dropDownStyle = {

		//left: document.querySelector(".DeliveriesPanel").offsetWidth + "px",
	};

	const setDisplayPanel = (value) => {
		setDisplayPanelTab(value);
	};

	const highlightDiv = () => {

		if(displayPanelTab === 0)
		{
			setRequestAttributes(["delivery-requests-label","highlight"]);
			setMyDeliveriesAttributes(["my-deliveries-label"]);
			setMyTasksAttribute(["my-tasks-label"]);
		}
		else if(displayPanelTab === 1)
		{
			setRequestAttributes(["delivery-requests-label"]);
			setMyDeliveriesAttributes(["my-deliveries-label","highlight"]);
			setMyTasksAttribute(["my-tasks-label"]);
		}
		else
		{
			setRequestAttributes(["delivery-requests-label"]);
			setMyDeliveriesAttributes(["my-deliveries-label"]);
			setMyTasksAttribute(["my-tasks-label","highlight"]);
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

		//double check this
		if(entryDiv !== null)
		{
			panel.scrollTop = entryDiv.offsetTop-(entryDiv.offsetHeight);

			entryDiv.classList.add("temp-highlight");
			setTimeout(function(){
				entryDiv.classList.remove("temp-highlight")
			},1000);
		}

	};

	//sorting array uses same array reference, which doesn't cause react re-render. You need to use spread operator to create new reference

	const sortByDate = () => {

		if(props.requests.length !== 0)
		{
			if(toggleSortByDate)
			{
				let arr = [];
				if(displayPanelTab === 0)
				{
					arr = props.requests;
				}
				else if (displayPanelTab === 1)
				{
					arr = props.myRequests;
				}
				else
				{
					arr = props.myTasks;
				}
	
				const sortedRequests = [...arr].sort((a,b)=> new Date(b.posted_date) - new Date(a.posted_date));
				setRequests(sortedRequests);
				setToggleSortByDate((prev)=> !prev);
			}
			else
			{
				let arr = [];
				if(displayPanelTab === 0)
				{
					arr = props.requests;
				}
				else if (displayPanelTab === 1)
				{
					arr = props.myRequests;
				}
				else
				{
					arr = props.myTasks;
				}
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

				let arr = [];
				console.log(displayPanelTab);
				if(displayPanelTab === 0)
				{
					arr = props.requests;
				
				}
				else if (displayPanelTab === 1)
				{
					arr = props.myRequests;
		
				}
				else
				{
					console.log(displayPanelTab);
					arr = props.myTasks;
				}

				const sortedRequests = [...arr].sort((a,b)=> new Date(b.date) - new Date(a.date));
				setRequests(sortedRequests);
				setToggleSortByVolunteerDate((prev)=> !prev);
			}
			else
			{
				let arr = [];
				if(displayPanelTab === 0)
				{
					arr = props.requests;
					
				}
				else if (displayPanelTab === 1)
				{
					arr = props.myRequests;

				}
				else
				{
					arr = props.myTasks;
				}

				const sortedRequests = [...arr].sort((a,b)=> new Date(a.date) - new Date(b.date));
				setRequests(sortedRequests);
				setToggleSortByVolunteerDate((prev)=> !prev);
			}
		}
	};

	const showAllCategories = () => {
		if(props.requests.length !== 0)
		{
			let arr = [];
			if(displayPanelTab === 0)
			{
				arr = props.requests;
			}
			else if (displayPanelTab === 1)
			{
				arr = props.myRequests;
			}
			else
			{
				arr = props.myTasks;
			}
			const sortedRequests = [...arr].sort((a,b)=> new Date(b.posted_date) - new Date(a.posted_date));
			setRequests(sortedRequests);
			setToggleSortByDate((prev)=> !prev);
			document.querySelector(".category-filter-container").style.backgroundColor = "#ffec00";
			document.querySelector(".category-filter").innerHTML = "Filter by Category";
		}
	}

	const filterCategory = (category) => {
	
		if(category === 'Groceries' || category==='Medicine'|| category==='Dog Walking' || category ==='Transportation' || category==='Assembly' || category==='Other')
		{

			if(props.requests.length !== 0)
			{
				let arr = [];
				if(displayPanelTab === 0)
				{
					arr = props.requests;
				}
				else if (displayPanelTab === 1)
				{
					arr = props.myRequests;
				}
				else
				{
					arr = props.myTasks;
				}
				const filteredRequests = [...arr].filter(request=>request.category === category);
				setRequests(filteredRequests);	
				document.querySelector(".category-filter-container").style.backgroundColor = "#7bc62d";
				document.querySelector(".category-filter").innerHTML = "Filtered By:" + category;
			}
		}


	};



	useEffect(()=>{
		if(props.scrollToEntry.length !== 0)
		{
			setScrollPosition();
		}
	},[props.scrollToEntry]);

	useEffect(()=>{

		highlightDiv();

		if(props.requests.length !== 0)
		{
			let arr = [];
			if(displayPanelTab === 0)
			{
				arr = props.requests;
				const sortedRequests = arr.sort((a,b)=> new Date(b.posted_date) - new Date(a.posted_date));
				setRequests(sortedRequests);
			}
			else if (displayPanelTab === 1)
			{
				arr = props.myRequests;
				const sortedRequests = arr.sort((a,b)=> new Date(b.posted_date) - new Date(a.posted_date));
				setRequests(sortedRequests);
			}
			else
			{
				arr = props.myTasks;
				const sortedRequests = arr.sort((a,b)=> new Date(b.posted_date) - new Date(a.posted_date));
				setRequests(sortedRequests);
			}
		}

		document.querySelector(".category-filter-container").style.backgroundColor = "#ffec00";
		document.querySelector(".category-filter").innerHTML = "Filter by Category";

	},[displayPanelTab])

	useEffect(()=>{

		if(props.requests.length !== 0)
		{
			let arr = [];
			if(displayPanelTab === 0)
			{
				arr = props.requests;
				const sortedRequests = arr.sort((a,b)=> new Date(b.posted_date) - new Date(a.posted_date));
				setRequests(sortedRequests);
			}
			else if (displayPanelTab === 1)
			{
				arr = props.myRequests;
				const sortedRequests = arr.sort((a,b)=> new Date(b.posted_date) - new Date(a.posted_date));
				setRequests(sortedRequests);
			}
			else
			{
				arr = props.myTasks;
				const sortedRequests = arr.sort((a,b)=> new Date(b.posted_date) - new Date(a.posted_date));
				setRequests(sortedRequests);
			}
		}

	},[props.requests,props.myRequests,props.myTasks]);


	return (
		<div className="DeliveriesPanel">
			{displayEntryModal ? <EntryModal requests={props.requests} currentEntryId={currentEntryId} closeEntryModal={closeEntryModal}/> : null}
			<div className="delivery-btn-container">
				<div className={requestAttributes.join(" ")} onClick={()=>{setDisplayPanel(0)}}>All Requests</div>
				<div className={myDeliveriesAttributes.join(" ")} onClick={()=>{setDisplayPanel(1)}}>My Requests</div>
				<div className={myTasksAttributes.join(" ")} onClick={()=>{setDisplayPanel(2)}}>My Tasks</div>
			</div>
			<div className="delivery-filter-row">
					<div className="filter-options" onClick={sortByDate}>Sort by Date Posted</div>
					<div className="filter-options" onClick={sortByVolunteerDate}>Sort by Volunteer Date</div>	
					<div className="category-filter-container">
						<div className="category-filter">Filter by Category</div>
						<div className="category-filter-dropdown" style={dropDownStyle}>
								<div className="category" onClick={()=>{showAllCategories()}}>All</div>
								<div className="category" onClick={()=>{filterCategory("Groceries")}}>Groceries</div>
								<div className="category" onClick={()=>filterCategory("Medicine")}>Medicine</div>
								<div className="category" onClick={()=>{filterCategory("Dog Walking")}}>Dog Walking</div>
								<div className="category" onClick={()=>{filterCategory("Transportation")}}>Transportation</div>
								<div className="category" onClick={()=>{filterCategory("Assembly")}}>Assembly</div>
								<div className="category" onClick={()=>{filterCategory("Other")}}>Other</div>
						</div>
					</div>	
			</div>
			<div className="delivery-details">
				{displayPanelTab === 0 ? requests.map((entry)=>{
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
				}) : displayPanelTab === 1 ? requests.map((entry)=>{
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
				}) : requests.map((entry)=>{ 
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
					})
				}
			</div>

		</div>
	)
};

export default DeliveriesPanel; 