import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import {
  faMapMarkerAlt,
  faLocationArrow,
  faArrowsAltV,
  faRoute,
  faCrosshairs,
  faMap,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import "./sidebar.css";

const Sidebar = (props) => {
  //handleclick for custom route toggle button (dupe for testing)
  const handleClick = () => {
    props.handleClick();
  };

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

      <div className="input-group-button">
        <FontAwesomeIcon className="mapIcon" icon={faMap} />
        <div className="content-wrapper">
          <div>Place Markers on Map</div>
          <label className="switch">
            <input
              type="checkbox"
              checked={props.isMarkerActive}
              onChange={handleClick}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div></div>

      <label>Choose Travel Mode</label>
      <div className="input-group">
        <FontAwesomeIcon icon={faArrowsAltV} />
        <select
          name="travelMode"
          id="travelMode"
          onChange={(e) => {
            if (e.target.value === "maximize") {
              props.setMinMax("max");
            } else {
              props.setMinMax("min");
            }
          }}
        >
          <option value="maximize">Maximize Elevation</option>
          <option value="minimize">Minimize Elevation</option>
        </select>
      </div>

      <button className="location-button" onClick={props.getCurrentLocation}>
        <FontAwesomeIcon icon={faCrosshairs} />
      </button>

      <div className="button-container">
        <button className="submit-button" onClick={props.clear}>
          Clear All
        </button>

        <button className="submit-button" onClick={props.fetchRoute}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
