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

const Map = ({isMarkerActive, setIsMarkerActive}) => {
    
    const [center, setCenter] = useState(null);
    //initial map zoom
    const ZOOM_LEVEL = 20;
    const mapRef = useRef();

    //start and end markers
    const [startMarkerPosition, setStartMarkerPosition] = useState(null);
    const [endMarkerPosition, setEndMarkerPosition] = useState(null);

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


      }, [isMarkerActive, startMarkerPosition, endMarkerPosition]);


    //render route once user chooses start/end
    let route = null;
    if(pathMade && coordinates) {
        const coordinates = null;
        route = <Polyline positions={coordinates} color="red" />;
    }

    

    //Add a marker on the map and update lat/long of start marker
    function AddMarkerStart() {

      useMapEvents({
        click: (e) => {
          const { lat, lng } = e.latlng;
          setStartMarkerPosition([lat, lng]);
          setClicks(clicks++);
        },
      });

      const customIcon = L.icon({
        iconUrl: customMarker,
        iconSize: [32, 32],
      });

      if(isMarkerActive == false) {
        setStartMarkerPosition(null);
        setClicks(0);
      }
  
      return startMarkerPosition === null ? null : (
        <Marker position={startMarkerPosition} icon={customIcon} draggable={false}></Marker>
      );
    }

    //Add a marker on the map and update lat/long of end marker
    function AddMarkerEnd() {
      useMapEvents({
        click: (e) => {
          const { lat, lng } = e.latlng;
          setEndMarkerPosition([lat, lng]);
          setClicks(clicks++);
        },
      });

      const customIcon = L.icon({
        iconUrl: customMarker,
        iconSize: [32, 32],
      });

      if(isMarkerActive == false) {
        setEndMarkerPosition(null);
        setClicks(0);
      }
  
      return endMarkerPosition === null ? null : (
        <Marker position={endMarkerPosition} icon={customIcon} draggable={false}></Marker>
      );
    }
      
      
    return center ? (
    
        <div className="map">
            <MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef} minZoom = {0}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <AddMarkerStart />
                <AddMarkerEnd />
                {route}
            </MapContainer>
            
        </div>

    ) : null;
};

export default Map;