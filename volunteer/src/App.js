import './App.css';
import Header from "./components/Header.js";
import MapImage from "./components/MapImage.js";
import DeliveriesPanel from "./components/DeliveriesPanel.js";
import {useState} from "react";
import RequestModal from "./components/RequestModal.js";

function App() {
  const [showRequestModal,setShowRequestModal] = useState(false);

  return (
    <div className="App">
      {showRequestModal ? <RequestModal setShowRequestModal={setShowRequestModal}/> : null}
      <Header setShowRequestModal={setShowRequestModal}/>
      <div className="main-content">
        <DeliveriesPanel/>
        <MapImage/>
      </div>
    </div>
  );
}

export default App;
