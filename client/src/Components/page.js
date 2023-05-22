import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import Map from "./Map";
import "./page.css"
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";

const Page = () => {

    //keep track of if custom route is toggled
    const [isMarkerActive, setIsMarkerActive] = useState(false);

    
    const setMarkerActive = () => {
        setIsMarkerActive(!isMarkerActive);
        console.log(isMarkerActive);
    }

    return(
        <div className={isMarkerActive ? {cursor:faCrosshairs} : ''}>
            <Map isMarkerActive={isMarkerActive} setIsMarkerActive={setIsMarkerActive}/>
            <Sidebar handleClick={setMarkerActive}/>
        </div>
    );
}

export default Page;