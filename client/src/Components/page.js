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

    return(
        <div className={isMarkerActive ? "cursor-crosshairs" : ""}>
            <Map isMarkerActive={isMarkerActive} setIsMarkerActive={setIsMarkerActive} startMarkerPosition={startMarkerPosition} endMarkerPosition={endMarkerPosition} setEndMarkerPosition={setEndMarkerPosition} setStartMarkerPosition={setStartMarkerPosition}/>
            <Sidebar handleClick={setMarkerActive} startMarkerPosition={startMarkerPosition} endMarkerPosition={endMarkerPosition} />
        </div>
    );
}

export default Page;