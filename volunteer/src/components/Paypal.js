import React,{useRef,useEffect} from "react";
import firebase from 'firebase/app'

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
				await actions.order.capture();
				

				/*firebase.firestore().collection("users").doc(props.currentUser.uid).collection("donations_raised").add({
					donations_raised: 
				});*/
				console.log(props.currentUser.currentUser.uid);
				var docRef = firebase.firestore().collection("users").doc(props.currentUser.currentUser.uid);
				docRef.get().then((doc) => {
					console.log(doc);
				    if (doc.exists) {
				        console.log("Document data:", doc.data());
				        let document_data = doc.data();
				        firebase.firestore().collection("users").doc(props.currentUser.currentUser.uid).update({
							donations_raised: (document_data.donations_raised + props.donationAmount),
						});

						console.log(props.currentTask);

						firebase.firestore().collection('requests').doc(props.currentTask).update({
							completed: true,
						});

						props.setDisplayCompletionModal(false)
				        //console.log(document_data.donations_raised);
				    } else {
				    	console.log("No such document!");
				    	console.log(props.donationAmount);

				    	firebase.firestore().collection("users").doc(props.currentUser.currentUser.uid).update({
							donations_raised: (props.donationAmount),
						});
						firebase.firestore().collection('requests').doc(props.currentTask).update({
							completed: true,
						});

						props.setDisplayCompletionModal(false)
				
				    }
				}).catch((error) => {
				    console.log("Error getting document:", error);
				});
			},
			onError: (err)=>{
				console.log(err);
			}
		}).render(paypal.current);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[]);

	return (
		<div>
			<div ref={paypal}></div>
		</div>
	);

};

export default Paypal;