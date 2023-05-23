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
            document.getElementById('start').value = `Lat: ${lat}, Lng: ${lng}`;
            setCenter([lat, lng]);
          });
        } else {
          alert("Geolocation is not supported by this browser.");
        }
      }

    return(
        <div className={isMarkerActive ? "cursor-crosshairs" : ""}>
            <Map center={center} setCenter={setCenter} isMarkerActive={isMarkerActive} setIsMarkerActive={setIsMarkerActive} startMarkerPosition={startMarkerPosition} endMarkerPosition={endMarkerPosition} setEndMarkerPosition={setEndMarkerPosition} setStartMarkerPosition={setStartMarkerPosition}/>
            <Sidebar handleClick={setMarkerActive} startMarkerPosition={startMarkerPosition} endMarkerPosition={endMarkerPosition} getCurrentLocation={getCurrentLocation} />
        </div>
    );
}

export default Page;