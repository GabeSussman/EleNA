import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faLocationArrow,
  faArrowsAltV,
  faRoute,
  faCrosshairs,
} from "@fortawesome/free-solid-svg-icons";

class Sidebar extends React.Component {

  getCurrentLocation = (event) => {
    event.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        document.getElementById('start').value = `Lat: ${lat}, Lng: ${lng}`;
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  render() {
    return (
      <div className="sidebar">
        <h2>EleNA</h2>

        <div className="input-group">
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          <input
            type="text"
            id="start"
            name="start"
            required
            placeholder="Choose starting point"
          />
        </div>

        <div className="input-group">
          <FontAwesomeIcon icon={faLocationArrow} />
          <input
            type="text"
            id="destination"
            name="destination"
            required
            placeholder="Choose destination"
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
            required
            placeholder="Choose deviation (%)"
          />
        </div>

        <label>Choose Travel Mode</label>
        <div className="input-group">
          <FontAwesomeIcon icon={faArrowsAltV} />
          <select name="travelMode" id="travelMode">
            <option value="maximize">Maximize Elevation</option>
            <option value="minimize">Minimize Elevation</option>
          </select>
        </div>
        <button className="submit-button">Submit</button>

        <button className="location-button" onClick={this.getCurrentLocation}>
          <FontAwesomeIcon icon={faCrosshairs} />
        </button>

        
      </div>
    );
  }
}

export default Sidebar;
