import React from "react";
import { Link } from "react-router-dom";
import app from "../firebase.js";
import history from '../history.js';
import {useState,useEffect} from "react";
import RequestModal from "./RequestModal.js";


function Header (props) {

	const [showRequestModal, setShowRequestModal] = useState(false);

	const openRequestModal = ()=>{
		console.log(props);
		setShowRequestModal(true);
	};

	const logOut = () => {
		app.auth().signOut().then(() => {
		  console.log("Successful log out!");
		  history.push("/login");
		}).catch((error) => {
		  console.error("Error in logging out:"+error);
		});
	};

	return (
		<div className="Header">
			{
                showRequestModal ? <RequestModal setShowRequestModal={setShowRequestModal}/>:null
            }
			<Link to={"/home"} className="link"><div className="title">Volunteer.Me</div></Link>
			<div className="header-btn-container">
				<div className="request-help-btn" onClick={openRequestModal}> Request Help</div>
				<Link to={"/chat"} className="link">
					<div className="chat">	
						<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-messages" width="30" height="30" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
						  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
						  <path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10" />
						  <path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2" />
						</svg>
					</div>
				</Link>

				<div className="inbox">
					<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-mailbox" width="30" height="30" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
					  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
					  <path d="M10 21v-6.5a3.5 3.5 0 0 0 -7 0v6.5h18v-6a4 4 0 0 0 -4 -4h-10.5" />
					  <path d="M12 11v-8h4l2 2l-2 2h-4" />
					  <path d="M6 15h1" />
					</svg>
				</div>
				<Link to={"/leaderboard"}>
					<div className="profile-btn">
							<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user" width="30" height="30" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
							  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
							  <circle cx="12" cy="7" r="4" />
							  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
							</svg>
				
					</div>
				</Link>

				<div className="log-out" onClick={logOut}>Log Out</div>
			</div>
		</div>
	);
}

export default Header;