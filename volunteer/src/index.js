import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from "firebase/app";
import "firebase/firestore";

firebase.initializeApp({
	apiKey: "AIzaSyDmj00TsgdwjngHDf2ZZFJn7hwMgF0qjdU",
    authDomain: "volunteerme-5c67e.firebaseapp.com",
    projectId: "volunteerme-5c67e",
    storageBucket: "volunteerme-5c67e.appspot.com",
    messagingSenderId: "925971761121",
    appId: "1:925971761121:web:063cc355ed2f01ddc534a0",
    measurementId: "G-E2DK8411R1"
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
