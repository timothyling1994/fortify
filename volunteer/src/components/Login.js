import React from "react";
import {useState,useEffect,useRef} from "react";
import {startFirebaseUI} from "../firebase.js";

function Login () {

	useEffect(()=>{
		startFirebaseUI('.firebase-auth-container');
	},[]);

	return (
		<div className="firebase-auth-container"></div>
	)
}

export default Login;