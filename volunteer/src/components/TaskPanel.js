import React from "react";
import {useState,useEffect} from "react";
import EntryModal from "./EntryModal.js";
import ConfirmCompletionModal from "./ConfirmCompletionModal.js";

function TaskPanel (props) {

	const [displayPanelTab,setDisplayPanelTab] = useState(0);

	const [requestAttributes,setRequestAttributes] = useState(["requests-label"]);
	const [myRequestsAttributes,setMyRequestsAttributes] = useState(["my-requests-label"]);
	const [myTasksAttributes,setMyTasksAttribute] = useState(["my-tasks-label"]);

	const [displayEntryModal,setDisplayEntryModal] = useState(false);
	const [currentEntryId,setCurrentEntryId] = useState("");
	const [currentTaskCompletedEntry,setCurrentTaskCompletedEntry] = useState("");
	const [requests,setRequests] = useState([]);
	
	const [toggleSortByDate,setToggleSortByDate] = useState(false);
	const [toggleSortByVolunteerDate,setToggleSortByVolunteerDate] = useState(true);
	const [displayCompletionModal,setDisplayCompletionModal] = useState(false);

	const setDisplayPanel = (value) => {
		setDisplayPanelTab(value);
	};

	const openEntryModal = (entryId) => {
		setCurrentEntryId(entryId);
		setDisplayEntryModal(true);
	};	

	const closeEntryModal = () => {
		setDisplayEntryModal(false);
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

		const setScrollPosition = () => {
		
			const panel = document.querySelector(".TaskPanel");
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

		if(props.scrollToEntry.length !== 0)
		{
			setScrollPosition();
		}
	},[props.scrollToEntry]);

	useEffect(()=>{

		const highlightDiv = () => {

			if(displayPanelTab === 0)
			{
				setRequestAttributes(["requests-label","highlight"]);
				setMyRequestsAttributes(["my-requests-label"]);
				setMyTasksAttribute(["my-tasks-label"]);
			}
			else if(displayPanelTab === 1)
			{
				setRequestAttributes(["requests-label"]);
				setMyRequestsAttributes(["my-requests-label","highlight"]);
				setMyTasksAttribute(["my-tasks-label"]);
			}
			else
			{
				setRequestAttributes(["requests-label"]);
				setMyRequestsAttributes(["my-requests-label"]);
				setMyTasksAttribute(["my-tasks-label","highlight"]);
			}
		};

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
				console.log(arr);
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

		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[props.requests,props.myRequests,props.myTasks]);


	return (
		<div className="TaskPanel">
			{displayEntryModal ? <EntryModal currentUser={props.currentUser} requests={props.requests} currentEntryId={currentEntryId} closeEntryModal={closeEntryModal}/> : null}
			{displayCompletionModal ? <ConfirmCompletionModal currentUser={props.currentUser} currentTaskCompletedEntry = {currentTaskCompletedEntry} setDisplayCompletionModal={setDisplayCompletionModal}/> : null}
			<div className="task-btn-container">
				<div className={requestAttributes.join(" ")} onClick={()=>{setDisplayPanel(0)}}>All Requests</div>
				<div className={myRequestsAttributes.join(" ")} onClick={()=>{setDisplayPanel(1)}}>My Requests</div>
				<div className={myTasksAttributes.join(" ")} onClick={()=>{setDisplayPanel(2)}}>My Tasks</div>
			</div>
			<div className="task-filter-row">
					<div className="filter-options" onClick={sortByDate}>Sort by Date Posted</div>
					<div className="filter-options" onClick={sortByVolunteerDate}>Sort by Volunteer Date</div>	
					<div className="category-filter-container">
						<div className="category-filter">Filter by Category</div>
						<div className="category-filter-dropdown">
								<div className="category" onClick={()=>{showAllCategories()}}>All</div>
								<div className="category" onClick={()=>{filterCategory("Groceries")}}>Groceries</div>
								<div className="category" onClick={()=>{filterCategory("Medicine")}}>Medicine</div>
								<div className="category" onClick={()=>{filterCategory("Dog Walking")}}>Dog Walking</div>
								<div className="category" onClick={()=>{filterCategory("Transportation")}}>Transportation</div>
								<div className="category" onClick={()=>{filterCategory("Assembly")}}>Assembly</div>
								<div className="category" onClick={()=>{filterCategory("Other")}}>Other</div>
						</div>
					</div>	
			</div>
			<div className="task-details">
				{displayPanelTab === 0 ? requests.map((entry)=>{
					return (
						<div className="entry" key={entry.entryId} id={entry.entryId} onClick={()=>{openEntryModal(entry.entryId)}}>
							<div className="entry-taskName-container">
								<div className="entry-taskName">{entry.taskName}</div>
							</div>
							<div className="entry-donation">{entry.donation_amount > 0 ? "$" + entry.donation_amount : "FREE"}</div>
							<div className="entry-location">{entry.location}</div>
							<div className="entry-date-container">
								<div className="entry-date-posted">posted: {entry.posted_date}</div>
								<div className="entry-volunteer-date"> date: {entry.date}</div>
							</div>
							{entry.status === "open" ? <div className="entry-status open">Volunteers {entry.status}</div> : 
							<div className="entry-status filled">Volunteers {entry.status}</div>}
			
							<div className="entry-volunteer-num">{entry.volunteers_accepted}/{entry.volunteers_needed} Volunteers Needed</div>
						</div>
					)
				}) : displayPanelTab === 1 ? requests.map((entry)=>{
					return (
						<div className="entry" key={entry.entryId} id={entry.entryId} onClick={()=>{openEntryModal(entry.entryId)}}>
							<div className="entry-taskName-container">
								<div className="entry-taskName">{entry.taskName}</div>
							</div>

							<div className="entry-donation">{entry.donation_amount > 0 ? "$" + entry.donation_amount : "FREE"}</div>
							<div className="entry-location">{entry.location}</div>
							<div className="entry-date-container">
								<div className="entry-date-posted">posted: {entry.posted_date}</div>
								<div className="entry-volunteer-date"> date: {entry.date}</div>
							</div>
							{entry.status === "open" ? <div className="entry-status open">Volunteers {entry.status}</div> : 
							<div className="entry-status filled">Volunteers {entry.status}</div>}
							<div className="entry-volunteer-num">{entry.volunteers_accepted}/{entry.volunteers_needed} Volunteers Needed</div>
							<div className="task-complete-container">
								{entry.completed ? 
									<div className="task-completed-btn"> Task Completed! </div> : 
									<div className="task-complete-btn" onClick={(e)=>{e.stopPropagation();setCurrentTaskCompletedEntry({entryId:entry.entryId,taskName:entry.taskName,location:entry.location,isDonating:entry.isDonating, donation:entry.donation_amount});setDisplayCompletionModal(true)}}>Task Completed?</div>
								}
							</div>
						</div>
					)
				}) : requests.map((entry)=>{ 
					return (
						<div className="entry" key={entry.entryId} id={entry.entryId} onClick={()=>{openEntryModal(entry.entryId)}}>
							<div className="entry-taskName-container">
								<div className="entry-taskName">{entry.taskName}</div>
							</div>
							<div className="entry-donation">{entry.donation_amount > 0 ? "$" + entry.donation_amount : "FREE"}</div>
							<div className="entry-location">{entry.location}</div>
							<div className="entry-date-container">
								<div className="entry-date-posted">posted: {entry.posted_date}</div>
								<div className="entry-volunteer-date"> date: {entry.date}</div>
							</div>
							{entry.status === "open" ? <div className="entry-status open">Volunteers {entry.status}</div> : 
							<div className="entry-status filled">Volunteers {entry.status}</div>}
							<div className="entry-volunteer-num">{entry.volunteers_accepted}/{entry.volunteers_needed} Volunteers Needed</div>
						</div>
					)
					})
				}
			</div>

		</div>
	)
};

export default TaskPanel; 