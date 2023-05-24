import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import {
  faMapMarkerAlt,
  faLocationArrow,
  faArrowsAltV,
  faRoute,
  faCrosshairs,
  faMap
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";




const Sidebar = (props) => {

  

  // const getCurrentLocation = () => {
    
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       const lat = position.coords.latitude;
  //       const lng = position.coords.longitude;
  //       document.getElementById('start').value = `Lat: ${lat}, Lng: ${lng}`;
  //       const coords = [lat,lng];
  //       return coords;
  //     });
  //   } else {
  //     alert("Geolocation is not supported by this browser.");
  //   }
  // }

  return (
    <div className="sidebar">
      <h2>EleNA</h2>

      <div className="input-group">
        <FontAwesomeIcon icon={faMapMarkerAlt} />
        <input
          type="text"
          id="start"
          name="start"
          value={props.startLat}
          onChange={(e) => props.setStartLat(e.target.value)}
          required
          placeholder="Choose starting point"
        />
        <input
          type="text"
          id="start"
          name="start"
          value={props.startLon}
          onChange={(e) => props.setStartLon(e.target.value)}
          required
          placeholder="Starting Longitude"
        />
      </div>

      <div className="input-group">
        <FontAwesomeIcon icon={faLocationArrow} />
        <input
          type="text"
          id="destination"
          name="destination"
          value={props.endLat}
          onChange={(e) => props.setEndLat(e.target.value)}
          required
          placeholder="Choose destination"
        />
        <input
          type="text"
          id="destination"
          name="destination"
          value={props.endLon}
          onChange={(e) => props.setEndLon(e.target.value)}
          required
          placeholder="Destination Latitude"
        />
      </div>

      <div className="input-group">
        <FontAwesomeIcon icon={faRoute} />
        <input
          type="number"
          id="deviation"
          name="deviation"
          min="0"
          max="100"
          value={props.percent}
          onChange={(e) => props.setPercent(e.target.value)}
          required
          placeholder="Choose deviation (%)"
        />
      </div>

      <div>
        <FontAwesomeIcon icon ={faMap} />
        <button onClick={props.handleClick}>
          Custom Route
          <FontAwesomeIcon icon={props.isMarkerActive ? faToggleOn : faToggleOff} />
        </button>
      </div>

      <label>Choose Travel Mode</label>
      <div className="input-group">
        <FontAwesomeIcon icon={faArrowsAltV} />
        <select name="travelMode" id="travelMode">
          <option value="maximize">Maximize Elevation</option>
          <option value="minimize">Minimize Elevation</option>
        </select>
      </div>

      <button className="location-button" onClick={props.getCurrentLocation}>
              <FontAwesomeIcon icon={faCrosshairs} />
      </button>

      <div className="button-container">
      <button className="submit-button" onClick={props.clear}>Clear All</button>

      <button className="submit-button" onClick={props.fetchRoute}>Submit</button>
      </div>
      
    </div>
  );
}

export default Sidebar;