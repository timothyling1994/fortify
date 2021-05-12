import React from "react";

function Leaderboard () {
	return (
		<div className="Leaderboard">
			<div className="leaderboard-header">Leaderboards</div>
			<div className="leaderboard-container">
				<div className="details-container">
					
					<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-crown" width="68" height="68" viewBox="0 0 24 24" stroke-width="2" stroke="#6f32be" fill="none" stroke-linecap="round" stroke-linejoin="round">
					  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
					  <path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z" />
					</svg>
					
					<div className="name"> Joey Smith </div>
					<div className="charity-amount">Total Raised for Charity: $8000</div>
				</div>
			</div>
			<div className="leaderboard-container">
				<div className="details-container">
					
					<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-crown" width="68" height="68" viewBox="0 0 24 24" stroke-width="2" stroke="#00bfd8" fill="none" stroke-linecap="round" stroke-linejoin="round">
					  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
					  <path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z" />
					</svg>
					
					<div className="name"> Frank McLuther </div>
					<div className="charity-amount">Total Raised for Charity: $8000</div>
				</div>
			</div>
			<div className="leaderboard-container">
				<div className="details-container">
					
					<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-crown" width="68" height="68" viewBox="0 0 24 24" stroke-width="2" stroke="#a905b6" fill="none" stroke-linecap="round" stroke-linejoin="round">
					  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
					  <path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z" />
					</svg>
					
					<div className="name"> Frank McLuther </div>
					<div className="charity-amount">Total Raised for Charity: $8000</div>
				</div>
			</div>
		</div>
	);
};

export default Leaderboard;