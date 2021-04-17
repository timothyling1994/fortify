import './App.css';
import Header from "./components/Header.js";
import MapImage from "./components/MapImage.js";
import DeliveriesPanel from "./components/DeliveriesPanel.js";
import {useState,useEffect,useMemo,useRef} from "react";
import RequestModal from "./components/RequestModal.js";
import firebase from "firebase";

function App() {

  const [showRequestModal,setShowRequestModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const requestsRef = useRef([]);

  const initFirestore = () => {
    requestsRef.current = [];
    
    let query = firebase.firestore().collection('requests');
    query.onSnapshot((snapshot)=>{
      let requestObjArr = [];
      snapshot.forEach((doc)=>{
        requestObjArr.push(doc.data());
      });
      setRequests(requestObjArr); 
    });
  
  };

  useEffect(()=>{
    initFirestore();
  },[]);

  return (
    <div className="App">
      {showRequestModal ? <RequestModal setShowRequestModal={setShowRequestModal}/> : null}
      <Header setShowRequestModal={setShowRequestModal}/>
      <div className="main-content">
        <DeliveriesPanel requests={requests}/>
        <MapImage requests={requests}/>
      </div>
    </div>
  );
}

export default App;
