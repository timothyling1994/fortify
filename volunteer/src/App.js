import './App.css';
import Header from "./components/Header.js";
import MapImage from "./components/MapImage.js";
import DeliveriesPanel from "./components/DeliveriesPanel.js";

function App() {
  return (
    <div className="App">
      <Header/>
      <div className="main-content">
        <DeliveriesPanel/>
        <MapImage/>
      </div>
    </div>
  );
}

export default App;
