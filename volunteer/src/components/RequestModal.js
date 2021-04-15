import react from "react";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import {useState} from "react";

import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';


function RequestModal (props) {

	const [requestDate,setRequestDate] = useState(new Date());
	
	const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
	const geoCodingService = mbxGeoCoding({ accessToken: 'pk.eyJ1IjoidGltb3RoeWxpbmcxOTk0IiwiYSI6ImNrbmZuOWFtbzFtM2YycG1pbTJkeWIwOXQifQ.Yhzp9YEOq_oqZPXQ28jKaw' });

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
	  	});
	};

	const closeRequestModal = () => {
		props.setShowRequestModal(false);
	};

	return (
		<div className="RequestModal">
			<div className="request-modal-container">
				<div className="request-category-label">What are you requesting?</div>
				<div className="request-main-category-container">
					<div className="request-category-container">
						<div className="request-category-image">
							<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-tools-kitchen-2" width="50" height="50" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffbf00" fill="none" stroke-linecap="round" stroke-linejoin="round">
							  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
							  <path d="M19 3v12h-5c-.023 -3.681 .184 -7.406 5 -12zm0 12v6h-1v-3m-10 -14v17m-3 -17v3a3 3 0 1 0 6 0v-3" />
							</svg>
						</div>
						<div className="request-category-groceries-label">Groceries</div>
					</div>
					<div className="request-category-container">
						<div className="request-category-image">
							<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pill" width="50" height="50" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffbf00" fill="none" stroke-linecap="round" stroke-linejoin="round">
							  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
							  <path d="M4.5 12.5l8 -8a4.94 4.94 0 0 1 7 7l-8 8a4.94 4.94 0 0 1 -7 -7" />
							  <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
							</svg>
						</div>
						<div className="request-category-medicine-label">Medicine</div>
					</div>
					<div className="request-category-container">
						<div className="request-category-image">
							<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-walk" width="50" height="50" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffbf00" fill="none" stroke-linecap="round" stroke-linejoin="round">
							  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
							  <circle cx="13" cy="4" r="1" />
							  <line x1="7" y1="21" x2="10" y2="17" />
							  <path d="M16 21l-2 -4l-3 -3l1 -6" />
							  <path d="M6 12l2 -3l4 -1l3 3l3 1" />
							</svg>
						</div>
						<div className="request-category-dog-label">Dog Walking</div>
					</div>

					<div className="request-category-container">
						<div className="request-category-image">
							<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-car" width="50" height="50" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffbf00" fill="none" stroke-linecap="round" stroke-linejoin="round">
							  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
							  <circle cx="7" cy="17" r="2" />
							  <circle cx="17" cy="17" r="2" />
							  <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
							</svg>
						</div>
						<div className="request-category-transportation-label">Transportation</div>
					</div>

					<div className="request-category-container">
						<div className="request-category-image">
							<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-tools" width="50" height="50" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffbf00" fill="none" stroke-linecap="round" stroke-linejoin="round">
							  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
							  <path d="M3 21h4l13 -13a1.5 1.5 0 0 0 -4 -4l-13 13v4" />
							  <line x1="14.5" y1="5.5" x2="18.5" y2="9.5" />
							  <polyline points="12 8 7 3 3 7 8 12" />
							  <line x1="7" y1="8" x2="5.5" y2="9.5" />
							  <polyline points="16 12 21 17 17 21 12 16" />
							  <line x1="16" y1="17" x2="14.5" y2="18.5" />
							</svg>
						</div>
						<div className="request-category-assembly-label">Assembly</div>
					</div>

					<div className="request-category-container">
						<div className="request-category-image">
							<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-package" width="50" height="50" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffbf00" fill="none" stroke-linecap="round" stroke-linejoin="round">
							  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
							  <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3" />
							  <line x1="12" y1="12" x2="20" y2="7.5" />
							  <line x1="12" y1="12" x2="12" y2="21" />
							  <line x1="12" y1="12" x2="4" y2="7.5" />
							  <line x1="16" y1="5.25" x2="8" y2="9.75" />
							</svg>
						</div>
						<div className="request-category-other-label">Other</div>
					</div>
				</div>
				<div className="request-location-container">
					<div className="request-location-label">Location:</div>
					<input className="request-location-input" placeholder="400 Brannan Street" onChange={()=>{autoCompleteLocation(document.querySelector(".request-location-input").value)}}/>
				</div>
				<div className="request-details-container">
					<div className="request-details-label">Details:</div>
					<textarea className="request-details-input" placeholder="Pick up my medication from the local CVS."></textarea>
				</div>
				<div className="request-date-container">
					<div className="request-date-label">Date:</div>
					<Flatpickr
				        data-enable-time
				        value={requestDate}
				        options={{ minDate: new Date() }} 
				        onChange={date => {
				          setRequestDate(date);
				        }}
				    />
				</div>
				<div className="request-delivery-btn-container">
					<div className="request-delivery-btn">Make Request</div>
					<div className="request-cancel-btn" onClick={closeRequestModal}>Cancel</div>
				</div>
			</div>
		</div>
	);
};

export default RequestModal; 