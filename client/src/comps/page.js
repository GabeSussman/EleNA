import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import Map from "./Map";
import "./page.css"
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";
import {faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Page = () => {

  const [loading, setLoading] = useState(false); // Add this to your states

    //keep track of if custom route is toggled
    const [isMarkerActive, setIsMarkerActive] = useState(false);

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

      if(!startLat || !startLon || !endLat || !endLon || !minMax || !percent) {
        alert("Please fill in all fields");
        return("");
      }
      setLoading(true);
      let url = 'http://localhost:5001/routes/'.concat(startLat).concat('/').concat(startLon).concat('/').concat(endLat).concat('/').concat(endLon)
      .concat('/').concat(minMax).concat('/').concat(percent/100)
      fetch(url)
      .then( response => response.json() )
      .then( data => {setRoute(data); setLoading(false); if(data === 'Error, start or end coordinate is out of bounds'){alert('Start or end is out of bounds'); clear()}})
    }

    //custom route button pressed, allows user to place markers
    const handleClick = () => {
        setIsMarkerActive(!isMarkerActive);
        setRoute(null);
    }

    //clear all button pressed, refreshes page
    const clear = () => {
      window.location.reload(true);
    }


    //center coordinates for map
    const [center, setCenter] = useState([42.3898, -72.5283]);

    //gets users current location
    const getCurrentLocation = () => {
    
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setStartLat(lat)
            setStartLon(lng)
            setCenter([lat, lng]);
          });
        } else {
          alert("Geolocation is not supported by this browser.");
        }
      }
    return(
        <div>
            <Map loading={loading} route={route} setRoute={setRoute} startLat={startLat} setStartLat={setStartLat} startLon={startLon} setStartLon={setStartLon}
              endLat={endLat} setEndLat={setEndLat} endLon={endLon} setEndLon={setEndLon} center={center} setCenter={setCenter} isMarkerActive={isMarkerActive} setIsMarkerActive={setIsMarkerActive} startMarkerPosition={startMarkerPosition} endMarkerPosition={endMarkerPosition} setEndMarkerPosition={setEndMarkerPosition} setStartMarkerPosition={setStartMarkerPosition}/>
            <Sidebar clear={clear} handleClick={handleClick} startMarkerPosition={startMarkerPosition} endMarkerPosition={endMarkerPosition} getCurrentLocation={getCurrentLocation} 
              startLat={startLat} setStartLat={setStartLat} startLon={startLon} setStartLon={setStartLon}
              endLat={endLat} setEndLat={setEndLat} endLon={endLon} setEndLon={setEndLon} percent={percent} 
              setPercent={setPercent} minMax={minMax} setMinMax={setMinMax} fetchRoute={fetchRoute}/>
        </div>
    );
}

export default Page;