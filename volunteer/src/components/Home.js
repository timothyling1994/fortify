import React from "react";

function Home (){
	return (
		<div className="Home">
	        <DeliveriesPanel requests={requests} myRequests={myRequests} myTasks={myTasks} scrollToEntry={scrollToEntry}/>
	        <MapImage requests={requests} scrollToId={scrollToId}/>
	    </div>
	);
};

export default Home;