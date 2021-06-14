import React,{useRef,useEffect} from "react";
import firebase from "firebase";

const Paypal = (props) => {

	const paypal = useRef(); 

	useEffect(()=>{
		window.paypal.Buttons({
			createOrder: (data,actions,err)=>{
				return actions.order.create({
					intent:"CAPTURE",
					purchase_units: [
						{

							description: "Test",
							amount: {
								currency_code: "USD",
								value: props.donationAmount,
							}
						}
					]

				})
			},
			onApprove: async (data,actions)=>{
				const order = await actions.order.capture();
				//

				/*
				var docRef = firebase.collection("users").doc(props.currentUser.uid);

				docRef.get().then((doc) => {
				    if (doc.exists) {
				        console.log("Document data:", doc.data());
				    } else {
				        // doc.data() will be undefined in this case
				        console.log("No such document!");
				    }
				}).catch((error) => {
				    console.log("Error getting document:", error);
				});*/



				/*firebase.firestore().collection("users").doc(props.currentUser.uid).collection("donations_raised").add({
					donations_raised: 
				});*/
				console.log(props.currentUser.currentUser.uid);
				var docRef = firebase.firestore().collection("users").doc(props.currentUser.currentUser.uid);
				docRef.get().then((doc) => {
				    if (doc.exists) {
				        console.log("Document data:", doc.data());
				        let document_data = doc.data();
				        firebase.firestore().collection("users").doc(props.currentUser.currentUser.uid).set({
							donations_raised: (document_data.donations_raised + props.donationAmount),
						});

						console.log(props.currentTask);

						firebase.firestore().collection('requests').doc(props.currentTask).update({
							completed: true,
						});

						props.setDisplayCompletionModal(false)
				        //console.log(document_data.donations_raised);
				    } else {
				        // doc.data() will be undefined in this case
				        console.log("No such document!");
				    }
				}).catch((error) => {
				    console.log("Error getting document:", error);
				});
			},
			onError: (err)=>{
				console.log(err);
			}
		}).render(paypal.current);
	},[]);

	return (
		<div>
			<div ref={paypal}></div>
		</div>
	);

};

export default Paypal;