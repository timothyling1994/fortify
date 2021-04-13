import React from "react";

function Header (props) {
	return (
		<div className="Header">
			<div className="title">Volunteer.Me</div>
			<div className="header-btn-container">
				<div className="request-help-btn"> Request Help</div>
				<div className="inbox">
					<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-mailbox" width="30" height="30" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
					  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
					  <path d="M10 21v-6.5a3.5 3.5 0 0 0 -7 0v6.5h18v-6a4 4 0 0 0 -4 -4h-10.5" />
					  <path d="M12 11v-8h4l2 2l-2 2h-4" />
					  <path d="M6 15h1" />
					</svg>
				</div>
				<div className="profile-btn">
					<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user" width="30" height="30" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
					  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
					  <circle cx="12" cy="7" r="4" />
					  <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
					</svg>
				</div>
			</div>
		</div>
	);
}

export default Header;