import React, { useRef, useEffect, useState } from 'react';
//import ReactDOM from 'react-dom';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';


function MapImage(props){

	const mapContainer = useRef();
	const [lng, setLng] = useState(-122.44);
	const [lat, setLat] = useState(37.76);
	const [zoom, setZoom] = useState(11.8);

	mapboxgl.workerClass = MapboxWorker;
	mapboxgl.accessToken = 'pk.eyJ1IjoidGltb3RoeWxpbmcxOTk0IiwiYSI6ImNrbmZuOWFtbzFtM2YycG1pbTJkeWIwOXQifQ.Yhzp9YEOq_oqZPXQ28jKaw';


	useEffect(()=>{
			const map = new mapboxgl.Map({
					container: mapContainer.current,
					style: 'mapbox://styles/mapbox/streets-v11',
					center: [lng, lat],
					zoom: zoom
			});
			
			if(props.requests.length > 0)
			{
				map.on('load',function(){

					let featuresArr = [];

					props.requests.forEach((request)=>{
						featuresArr.push({
							type: 'Feature',
						    geometry: {
						      type: 'Point',
						      coordinates: request.coords
						    },
						    properties: {
						      title: request.taskName,
						      description: request.location,
						      entryId:request.entryId,
						    }
						})
					});

					let geojson = {
					  type: 'FeatureCollection',
					  features: featuresArr
					};

					geojson.features.forEach(function(marker){
						let el = document.createElement('div');
						el.setAttribute("id","marker-"+marker.properties.entryId);
						el.className="marker";
						el.addEventListener("click",function(e){
							props.setScrollToEntry([e.target.id]);
						});
			
						new mapboxgl.Marker(el)
						  .setLngLat(marker.geometry.coordinates)
						  .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
						    .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
						  .addTo(map);
					})

				});
			}

			map.on('move', () => {
				setLng(map.getCenter().lng.toFixed(4));
				setLat(map.getCenter().lat.toFixed(4));
				setZoom(map.getZoom().toFixed(2));
			});


			return () => {
				if(map !== undefined) {
					map.remove()
				}
			};


	},[props.requests]);

	return(
		<div>
			<div className="display">lat:{lat} long:{lng} zoom:{zoom}</div>
			<div className="MapImage" ref={mapContainer}></div>
		</div>
	);
}

export default MapImage;