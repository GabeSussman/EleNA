import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import Map from "./Map";
import "./page.css"
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";

const Page = () => {

    //keep track of if custom route is toggled
    const [isMarkerActive, setIsMarkerActive] = useState(false);

    //start and end toggle buttons
    const [startToggle, setStartToggle] = useState(false);
    const [endToggle, setEndToggle] = useState(false);

    //start and end markers
    const [startMarkerPosition, setStartMarkerPosition] = useState(null);
    const [endMarkerPosition, setEndMarkerPosition] = useState(null);

    // useStates for backend data
    const [startLat, setStartLat] = useState()
    const [startLon, setStartLon] = useState()
    const [endLat, setEndLat] = useState()
    const [endLon, setEndLon] = useState()
    const [percent, setPercent] = useState()
    const [minMax, setMinMax] = useState('max')
    const [route, setRoute] = useState()

    // route fetching function
    const fetchRoute = () => {
      let url = 'http://localhost:5000/routes/'.concat(startLat).concat('/').concat(startLon).concat('/').concat(endLat).concat('/').concat(endLon)
      .concat('/').concat(minMax).concat('/').concat(percent)
      fetch(url)
      .then( response => response.json() )
      .then( data => setRoute(data))
    }

    //custom route button pressed
    const setMarkerActive = () => {
        setIsMarkerActive(!isMarkerActive);
        console.log(isMarkerActive);
    }

    //center coords
    const [center, setCenter] = useState([42.3898, -72.5283]);

    const getCurrentLocation = () => {
    
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            //document.getElementById('start').value = `Lat: ${lat}, Lng: ${lng}`;
            setStartLat(lat)
            setStartLon(lng)
            setCenter([lat, lng]);
          });
        } else {
          alert("Geolocation is not supported by this browser.");
        }
      }

    return(
        <div className={isMarkerActive ? "cursor-crosshairs" : ""}>
            <Map center={center} setCenter={setCenter} isMarkerActive={isMarkerActive} setIsMarkerActive={setIsMarkerActive} startMarkerPosition={startMarkerPosition} endMarkerPosition={endMarkerPosition} setEndMarkerPosition={setEndMarkerPosition} setStartMarkerPosition={setStartMarkerPosition}/>
            <Sidebar handleClick={setMarkerActive} startMarkerPosition={startMarkerPosition} endMarkerPosition={endMarkerPosition} getCurrentLocation={getCurrentLocation} 
              startLat={startLat} setStartLat={setStartLat} startLon={startLon} setStartLon={setStartLon}
              endLat={endLat} setEndLat={setEndLat} endLon={endLon} setEndLon={setEndLon} percent={percent} 
              setPercent={setPercent} minMax={minMax} setMinMax={setMinMax} fetchRoute={fetchRoute}/>
        </div>
    );
}

export default Page;