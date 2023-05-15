import React, { useState } from "react";
import Header from './Header';
import "./map.css";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import { useRef } from "react";
import "leaflet/dist/leaflet.css";



var path;
var start = path[0];
var end = path[path.length];


function setPath(p) {
    path = p;
}

function getPath() {
    return coordinates;
}

function setStart(coords) {
    start = coords;
}

function setEnd(coords) {
    end = coords;
}


var coordinates = [
    [42.391155, -72.5199],
    [42.4,-72.5]

];

const BasicMap = () => {
    const [center, setCenter] = useState({ lat: 42.391155, lng: -72.5199 });
    const ZOOM_LEVEL = 20;
    const mapRef = useRef();

    return (
    
        <div className="col">
            <MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline positions={getPath()} color = "red" />
            </MapContainer>
        </div>

    );
};

export default BasicMap;
