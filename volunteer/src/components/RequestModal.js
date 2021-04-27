//import react from "react";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import {useState,useEffect} from "react";

//import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-webpack-loader-syntax
//import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import uniqid from "uniqid";
import {ToastContainer,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import firebase from "firebase";


function RequestModal (props) {

	const [requestDate,setRequestDate] = useState(new Date());
	const [currentForm,setCurrentForm] = useState({});

	const invalid_form = (message) => toast.error(message, {
		position: "top-right",
		autoClose: 3000,
		hideProgressBar: false,
		closeOnClick: true,
		draggable: true,
		progress: undefined,
	});

	let styles = {
		fontSize: '20px',
		fontFamily: 'Noto Sans, sans-serif',
	}
	
	const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
	const geoCodingService = mbxGeoCoding({ accessToken: 'pk.eyJ1IjoidGltb3RoeWxpbmcxOTk0IiwiYSI6ImNrbmZuOWFtbzFtM2YycG1pbTJkeWIwOXQifQ.Yhzp9YEOq_oqZPXQ28jKaw' });

	const [autoCompleteAddresses, setAutoCompleteAddresses] = useState([]);

	const autoCompleteLocation = (query) => {
		geoCodingService.forwardGeocode({
		  query: `${query}`,
		  mode:"mapbox.places",
		  types:['country','address','region','postcode','place','locality','district','place','poi','neighborhood'],
		  autocomplete:true,
		  limit:5,
		  proximity: [-122.414, 37.776]
		})
		  .send()
		  .then(response => {
		    const match = response.body;
		    console.log(match);
		    setAutoCompleteAddresses(match.features);
	  	});
	};

	const closeRequestModal = () => {
		props.setShowRequestModal(false);
	};

	const addRequest = () => {

		if(Object.keys(currentForm).length !== 0)
		{
			let today = new Date();
			let posted_date = (today.getFullYear())+'-'+(today.getMonth()+1)+'-'+(today.getDate());

			firebase.firestore().collection('requests').add({
				category:currentForm.request_category_input,
				coords:currentForm.request_location_coords,
				date:currentForm.request_date_input,
				taskName:currentForm.request_details_input,
				location:currentForm.request_location_input,
				posterId:"firebaseId",
				volunteerId:"",
				posted_date: posted_date,

			}).then((docRef)=>{
				console.log(docRef.id);
				firebase.firestore().collection('users').doc('firebaseId').collection('my_requests').doc().set({
					requestId: docRef.id,
				});
			});

		

			closeRequestModal();
		}
	};

	const addCategoryHighlight = (event) => {
		
		let nodelist = document.querySelectorAll(".request-category-container");
		nodelist.forEach(node=>{
			if(node.classList.contains("request-category-highlight"))
			{
				node.classList.remove("request-category-highlight");
			}
		});
		event.target.closest(".request-category-container").classList.add("request-category-highlight");
	};

	const formValidation = async () => {

		console.log("reachy");
		let request_selected_category = document.querySelector(".request-category-highlight");
		let request_location_input = document.querySelector(".request-location-input").value;
		let request_details_input = document.querySelector(".request-details-input").value;
		let request_date_input = document.querySelector(".request-date-input").value;
		let request_location_coords = [];

		if(request_location_input !== '' && request_details_input !== '' && request_date_input !== '' && request_selected_category !== null)
		{
			let response = await geoCodingService.forwardGeocode({
			  query: request_location_input,
			  mode:"mapbox.places",
			  types:['address','poi'],
			  limit:5,
			  proximity: [-122.414, 37.776]
			}).send();

			const match = response.body;

			let isExactMatch = false;

		    for (let i=0; i<match.features.length;i++)
		    {
		    	if (match.features[i].place_name === request_location_input)
		    	{
		    		isExactMatch = true;
		    		request_location_coords = [...match.features[i].geometry.coordinates];

		    		let request_category_input = request_selected_category.textContent;

		    		setCurrentForm({
						request_location_input,
						request_details_input,
						request_date_input,
						request_category_input,
						request_location_coords,
					});

		    	}
		    }

		    if(!isExactMatch)
			{
				invalid_form('Invalid Address!');
			}
		}
		else
		{

			if(request_location_input === '')
			{
				invalid_form('Invalid Address!');
			}

			if(request_details_input === '')
			{
				invalid_form('Invalid Details!');
			}

			if(request_date_input === '')
			{
				invalid_form('Invalid Date!');
			}
			if(request_selected_category === null)
			{
				invalid_form('Please select category!');
			}

		}	
	};

	useEffect(()=>{

		addRequest();

	},[currentForm]);

	return (
		<div className="RequestModal">
			<ToastContainer style={styles}/>
			<div className="request-modal-container">
				<div className="request-category-header">What are you requesting?</div>
				<div className="request-details-container">
					<div className="request-details-label">Task:</div>
					<input className="request-details-input" placeholder="Pick up my medication from the local CVS."></input>
				</div>
				<div className="request-location-container">
					<div className="request-location-label">Location:</div>
					
					<input className="request-location-input" list="locations" placeholder="400 Brannan Street" onChange={()=>{autoCompleteLocation(document.querySelector(".request-location-input").value)}}/>

					<datalist id="locations">
						{autoCompleteAddresses.map((address)=>{
							return <option key={uniqid()} value={address.place_name}/>	
						})}
					</datalist>
				</div>
				<div className="request-date-container">
					<div className="request-date-label">Date:</div>
					<Flatpickr
				        data-enable-time
				        value={requestDate}
				        className="request-date-input"
				        options={{ minDate: new Date() }} 
				        onChange={date => {
				          setRequestDate(date);
				        }}
				    />
				</div>
				<div className="request-main-category-container">
					<div className="request-category-container" onClick={(e)=>{addCategoryHighlight(e)}}>
						<div className="request-category-image">
							<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-tools-kitchen-2" width="50" height="50" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffbf00" fill="none" strokeLinecap="round" strokeLinejoin="round">
							  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
							  <path d="M19 3v12h-5c-.023 -3.681 .184 -7.406 5 -12zm0 12v6h-1v-3m-10 -14v17m-3 -17v3a3 3 0 1 0 6 0v-3" />
							</svg>
						</div>
						<div className="request-category-label">Groceries</div>
					</div>
					<div className="request-category-container" onClick={(e)=>{addCategoryHighlight(e)}}>
						<div className="request-category-image">
							<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-pill" width="50" height="50" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffbf00" fill="none" strokeLinecap="round" strokeLinejoin="round">
							  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
							  <path d="M4.5 12.5l8 -8a4.94 4.94 0 0 1 7 7l-8 8a4.94 4.94 0 0 1 -7 -7" />
							  <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
							</svg>
						</div>
						<div className="request-category-label">Medicine</div>
					</div>
					<div className="request-category-container" onClick={(e)=>{addCategoryHighlight(e)}}>
						<div className="request-category-image">
							<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-walk" width="50" height="50" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffbf00" fill="none" strokeLinecap="round" strokeLinejoin="round">
							  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
							  <circle cx="13" cy="4" r="1" />
							  <line x1="7" y1="21" x2="10" y2="17" />
							  <path d="M16 21l-2 -4l-3 -3l1 -6" />
							  <path d="M6 12l2 -3l4 -1l3 3l3 1" />
							</svg>
						</div>
						<div className="request-category-label">Dog Walking</div>
					</div>

					<div className="request-category-container" onClick={(e)=>{addCategoryHighlight(e)}}>
						<div className="request-category-image">
							<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-car" width="50" height="50" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffbf00" fill="none" strokeLinecap="round" strokeLinejoin="round">
							  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
							  <circle cx="7" cy="17" r="2" />
							  <circle cx="17" cy="17" r="2" />
							  <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
							</svg>
						</div>
						<div className="request-category-label">Transportation</div>
					</div>

					<div className="request-category-container" onClick={(e)=>{addCategoryHighlight(e)}}>
						<div className="request-category-image">
							<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-tools" width="50" height="50" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffbf00" fill="none" strokeLinecap="round" strokeLinejoin="round">
							  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
							  <path d="M3 21h4l13 -13a1.5 1.5 0 0 0 -4 -4l-13 13v4" />
							  <line x1="14.5" y1="5.5" x2="18.5" y2="9.5" />
							  <polyline points="12 8 7 3 3 7 8 12" />
							  <line x1="7" y1="8" x2="5.5" y2="9.5" />
							  <polyline points="16 12 21 17 17 21 12 16" />
							  <line x1="16" y1="17" x2="14.5" y2="18.5" />
							</svg>
						</div>
						<div className="request-category-label">Assembly</div>
					</div>

					<div className="request-category-container" onClick={(e)=>{addCategoryHighlight(e)}}>
						<div className="request-category-image">
							<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-package" width="50" height="50" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffbf00" fill="none" strokeLinecap="round" strokeLinejoin="round">
							  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
							  <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3" />
							  <line x1="12" y1="12" x2="20" y2="7.5" />
							  <line x1="12" y1="12" x2="12" y2="21" />
							  <line x1="12" y1="12" x2="4" y2="7.5" />
							  <line x1="16" y1="5.25" x2="8" y2="9.75" />
							</svg>
						</div>
						<div className="request-category-label">Other</div>
					</div>
				</div>
				<div className="request-delivery-btn-container">
					<div className="request-delivery-btn" onClick={formValidation}>Make Request</div>
					<div className="request-cancel-btn" onClick={closeRequestModal}>Cancel</div>
				</div>
			</div>
		</div>
	);
};

export default RequestModal; 