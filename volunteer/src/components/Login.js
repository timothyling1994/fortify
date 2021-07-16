import React from "react";
import {useState,useEffect,useRef} from "react";
import {startFirebaseUI} from "../firebase.js";
import 'firebaseui/dist/firebaseui.css'

function Login () {

	useEffect(()=>{
		startFirebaseUI('.firebase-auth-container');
	},[]);

	return (
		<div className="Login">	
			<div className="firebase-auth-container"></div>
		</div>
	)
}

export default Login;