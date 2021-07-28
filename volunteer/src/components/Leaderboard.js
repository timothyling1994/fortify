import React from "react";
import {useState,useEffect,useRef} from "react";
import firebase from 'firebase/app'

const Leaderboard = (props) => {

	const [leaderboardObj, setLeaderboardObj] = useState({});
	let leaderboardRef = useRef({});

	const getLeaderBoard = () => {

		let query = firebase.firestore().collection('users');

		query.onSnapshot(async(snapshot) => {

			snapshot.docs.map(async (doc) => {

				let copyObj = {
					...leaderboardRef.current
				};

				copyObj[doc.id] = doc.data();
				
				leaderboardRef.current = {
					...copyObj
				};

				setLeaderboardObj(leaderboardRef.current);

			});
		});
	};

	useEffect(() => {
		console.log(leaderboardObj);
	},[leaderboardObj]);

	useEffect(() => {

		getLeaderBoard();

	},[props.user]);

	/*return (
						<div className="leaderboard-container">
							<div className="details-container">
								
								<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-crown" width="68" height="68" viewBox="0 0 24 24" strokeWidth="2" stroke="#6f32be" fill="none" strokeLinecap="round" strokeLinejoin="round">
								  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
								  <path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z" />
								</svg>
								
								<div className="name"> {leaderboardObj[keyName]} </div>
								<div className="charity-amount">Total Raised for Charity: $8000</div>
							</div>
						</div>
						);*/

	return(
		<div className="Leaderboard">
			<div className="leaderboard-header">Leaderboard</div>
			<div>
			{ Object.keys(leaderboardObj).map(function(keyName,keyIndex){
				return(
					<div className="leaderboard-container">
						<div className="details-container">
							
							<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-crown" width="68" height="68" viewBox="0 0 24 24" strokeWidth="2" stroke="#6f32be" fill="none" strokeLinecap="round" strokeLinejoin="round">
							  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
							  <path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z" />
							</svg>
							
							<div className="name"> {keyName} </div>
							<div className="charity-amount">Raised ${leaderboardObj[keyName].donations_raised} for Charity</div>
						</div>
					</div>
				)
			})}
			</div>		
		</div>
	);
};

export default Leaderboard;