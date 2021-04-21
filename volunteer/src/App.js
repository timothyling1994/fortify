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
  const [scrollToEntry,setScrollToEntry] = useState([]);
  const requestsRef = useRef([]);

  const initFirestore = () => {
    requestsRef.current = [];
    
    let query = firebase.firestore().collection('requests');
    query.onSnapshot((snapshot)=>{
      let requestObjArr = [];
      snapshot.forEach((doc)=>{
        let requestObj = doc.data();
        requestObj.entryId = doc.id;
        requestObjArr.push(requestObj);
      });
      setRequests(requestObjArr); 
    });
  
  };

  const scrollToId = (divId) => {
    setScrollToEntry([divId]);
  };

  useEffect(()=>{
    initFirestore();
  },[]);

  return (
    <div className="App">
      {showRequestModal ? <RequestModal setShowRequestModal={setShowRequestModal}/> : null}
      <Header setShowRequestModal={setShowRequestModal}/>
      <div className="main-content">
        <DeliveriesPanel requests={requests} scrollToEntry={scrollToEntry}/>
        <MapImage requests={requests} scrollToId={scrollToId}/>
      </div>
    </div>
  );
}

export default App;
