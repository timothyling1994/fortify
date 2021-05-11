import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import * as firebaseui from 'firebaseui';
import { withRouter } from "react-router-dom";
import history from './history.js';
import App from './App.js';


const app = firebase.initializeApp({
	apiKey: "AIzaSyDmj00TsgdwjngHDf2ZZFJn7hwMgF0qjdU",
    authDomain: "volunteerme-5c67e.firebaseapp.com",
    projectId: "volunteerme-5c67e",
    storageBucket: "volunteerme-5c67e.appspot.com",
    messagingSenderId: "925971761121",
    appId: "1:925971761121:web:063cc355ed2f01ddc534a0",
    measurementId: "G-E2DK8411R1"
});



let ui = new firebaseui.auth.AuthUI(app.auth());

export const uiConfig = {
callbacks: {
  signInSuccessWithAuthResult: function(authResult, redirectUrl) {
  	console.log("SUCCESS");
  	console.log(app.auth().currentUser);

  	//let user = app.auth().currentUser;
  	//App.setUser(user.displayName,user.email,user.photoURL,user.getToken);

    // User successfully signed in.
    // Return type determines whether we continue the redirect automatically
    // or whether we leave that to developer to handle.
    history.push("/home");
    return false;
  },
  uiShown: function() {
    // The widget is rendered.
    // Hide the loader.
    //document.getElementById('loader').style.display = 'none';
  }
},
// Will use popup for IDP Providers sign-in flow instead of the default, redirect.
signInFlow: 'popup',
signInSuccessUrl: '',
signInOptions: [
  // Leave the lines as is for the providers you want to offer your users.
  firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  firebase.auth.EmailAuthProvider.PROVIDER_ID,

],
// Terms of service url.
tosUrl: '<your-tos-url>',
// Privacy policy url.
privacyPolicyUrl: '<your-privacy-policy-url>'
};

const startFirebaseUI = (elementId) => {
	ui.start(elementId, uiConfig);
};

export { startFirebaseUI }
export default app;
//export { base };
