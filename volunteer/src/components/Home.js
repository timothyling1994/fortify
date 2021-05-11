import React from "react";
import MapImage from "./MapImage.js";
import DeliveriesPanel from "./DeliveriesPanel.js";
import {useState,useEffect,useContext} from "react";
import { AuthContext } from "../auth.js";

function Home (props){

	const currentUser = useContext(AuthContext);

	useEffect(()=>{
		if(currentUser.currentUser !== null)
		{
			console.log("CHANGED");
			let user = currentUser.currentUser;
			//console.log(user.displayName);	    

		    props.setUser(user.displayName,user.email,user.photoURL,user.uid);
		}
	},[]);



	return (
		<div className="Home">
	        <DeliveriesPanel currentUser={props.currentUser} requests={props.requests} myRequests={props.myRequests} myTasks={props.myTasks} scrollToEntry={props.scrollToEntry}/>
	        <MapImage requests={props.requests} scrollToId={props.scrollToId}/>
	    </div>
	);
};

export default Home;