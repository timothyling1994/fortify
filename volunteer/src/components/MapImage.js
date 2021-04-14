import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import Icon from "maki/icons/marker-15.svg";


function MapImage(props){

	const mapContainer = useRef();
	const [lng, setLng] = useState(-122.44);
	const [lat, setLat] = useState(37.76);
	const [zoom, setZoom] = useState(11.8);


	mapboxgl.workerClass = MapboxWorker;
	mapboxgl.accessToken = 'pk.eyJ1IjoidGltb3RoeWxpbmcxOTk0IiwiYSI6ImNrbmZuOWFtbzFtM2YycG1pbTJkeWIwOXQifQ.Yhzp9YEOq_oqZPXQ28jKaw';

	useEffect(() => {
		const map = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [lng, lat],
			zoom: zoom
		});

		map.on('load',function(){

			let geojson = {
			  type: 'FeatureCollection',
			  features: [
			  {
			    type: 'Feature',
			    geometry: {
			      type: 'Point',
			      coordinates: [-122.414, 37.776]
			    },
			    properties: {
			      title: 'Mapbox',
			      description: 'San Francisco, California'
			    }
			  }]
			};

			geojson.features.forEach(function(marker){
				let el = document.createElement('div');
				el.className="marker";
				//el.style.backgroundImage = `url(${Icon})`;
				

				new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
			})

		});

		map.on('move', () => {
			setLng(map.getCenter().lng.toFixed(4));
			setLat(map.getCenter().lat.toFixed(4));
			setZoom(map.getZoom().toFixed(2));
		});

		return () => map.remove();
	}, []);

	//<div className="display">lat:{lat} long:{lng} zoom:{zoom}</div>
	return(
		<div>
			<div className="display">lat:{lat} long:{lng} zoom:{zoom}</div>
			<div className="MapImage" ref={mapContainer}>

			</div>
		</div>
	);
}

export default MapImage;