import React, { useState } from "react";
import Header from './Header';
import "./map.css";
import { MapContainer, TileLayer } from "react-leaflet";
import { useRef } from "react";
import "leaflet/dist/leaflet.css";


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
            </MapContainer>
        </div>

    );
};

export default BasicMap;
