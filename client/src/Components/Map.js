import React, { useState, useEffect } from "react";
import "./map.css";
import { MapContainer, TileLayer, Polyline, Marker, useMapEvents } from "react-leaflet";
import { useRef } from "react";
import "leaflet/dist/leaflet.css";
import "./sidebar";
import L from 'leaflet';
import customMarker from './redmarker.png';
import "./page";


//has a path been drawn
const pathMade = false;


//converts api data to usable coordinates
function convertCoords(coordinates) {
    var c = [];
      for(var i = 0; i < coordinates.length; i++) {
        const coords = [
            coordinates[i].node.lat,
            coordinates[i].node.lon
        ]
        c.push(coords);
      }
    pathMade = true;
    return c;
}

const Map = ({isMarkerActive, setIsMarkerActive, startMarkerPosition, endMarkerPosition, setEndMarkerPosition, setStartMarkerPosition, center, setCenter}) => {
    
    //initial map zoom
    const ZOOM_LEVEL = 20;
    const mapRef = useRef();


    //path coordinates
    let coordinates = [null, null];

    //keep track of clicks(markers placed)
    let [clicks, setClicks] = useState(0);
    
    

    useEffect(() => {
        // Get current position using Geolocation API
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCenter([latitude, longitude]); // Update center with current position
          },
          (error) => {
            console.error('Error getting current position:', error);
          }
        );


      }, [isMarkerActive, startMarkerPosition, endMarkerPosition, center]);


    //render route once user chooses start/end
    let route = null;
    if(pathMade && coordinates) {
        const coordinates = null;
        route = <Polyline positions={coordinates} color="red" />;
    }

    
    function AddMarker() {
      const customIcon = L.icon({
          iconUrl: customMarker,
          iconSize: [32, 32],
      });
  
      useMapEvents({
          click: (e) => {
              const { lat, lng } = e.latlng;
              if (clicks === 0) {
                  setStartMarkerPosition([lat, lng]);
              } else if (clicks === 1) {
                  setEndMarkerPosition([lat, lng]);
              }
              setClicks(prevClicks => prevClicks + 1);
          },
      });
  
      if (isMarkerActive === false) {
          setStartMarkerPosition(null);
          setEndMarkerPosition(null);
          setClicks(0);
      }
  
      return (
          <>
              {startMarkerPosition && <Marker position={startMarkerPosition} icon={customIcon} draggable={false} />}
              {endMarkerPosition && <Marker position={endMarkerPosition} icon={customIcon} draggable={false} />}
          </>
      );
  }
      
    return center ? (
    
        <div className="map">
            <MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef} minZoom = {0}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <AddMarker />
                {route}
            </MapContainer>
            
        </div>

    ) : null;
};

export default Map;