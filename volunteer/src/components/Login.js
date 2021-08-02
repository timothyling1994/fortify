import React from "react";
import {useEffect} from "react";
import {startFirebaseUI} from "../firebase.js";
import 'firebaseui/dist/firebaseui.css'

function Login () {

	useEffect(()=>{
		startFirebaseUI('.firebase-auth-container');
	},[]);

	return (
		<div className="Login">	
			<div className="home-page-title">Volunteer.Me</div>
			<div className="firebase-auth-container"></div>
			<div className="home-page-pic"><img src="/volunteer-hands.gif" alt="graphic of raising hands"/></div>
			<div className="home-page-created-by"></div>
		</div>
	)
}

export default Login;