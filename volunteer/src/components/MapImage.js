import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import Icon from "maki/icons/marker-15.svg";
import firebase from "firebase";


function MapImage(props){

	const mapContainer = useRef();
	const [lng, setLng] = useState(-122.44);
	const [lat, setLat] = useState(37.76);
	const [zoom, setZoom] = useState(11.8);
	const [renderMap,setRenderMap] = useState(false);

	mapboxgl.workerClass = MapboxWorker;
	mapboxgl.accessToken = 'pk.eyJ1IjoidGltb3RoeWxpbmcxOTk0IiwiYSI6ImNrbmZuOWFtbzFtM2YycG1pbTJkeWIwOXQifQ.Yhzp9YEOq_oqZPXQ28jKaw';

	useEffect(() => {

		if(props.requests.length !== 0) 
		{
			setRenderMap(true);
		}

	}, [props.requests]);

	useEffect(()=>{

		if(renderMap == true)
		{

			const map = new mapboxgl.Map({
					container: mapContainer.current,
					style: 'mapbox://styles/mapbox/streets-v11',
					center: [lng, lat],
					zoom: zoom
			});
			
			map.on('load',function(){

				let featuresArr = [];

				console.log("mapimage.js");
				console.log(props.requests);

				props.requests.forEach((request)=>{
					featuresArr.push({
						type: 'Feature',
					    geometry: {
					      type: 'Point',
					      coordinates: request.coords
					    },
					    properties: {
					      title: request.taskName,
					      description: request.location
					    }
					})
				});

				let geojson = {
				  type: 'FeatureCollection',
				  features: featuresArr
				};

				geojson.features.forEach(function(marker){
					let el = document.createElement('div');
					el.className="marker";
		
					new mapboxgl.Marker(el)
					  .setLngLat(marker.geometry.coordinates)
					  .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
					    .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
					  .addTo(map);
				})

			});

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
		}

	},[renderMap,props.requests]);

	return(
		<div>
			<div className="display">lat:{lat} long:{lng} zoom:{zoom}</div>
			{renderMap ? <div className="MapImage" ref={mapContainer}></div> : null}
		</div>
	);
}

export default MapImage;