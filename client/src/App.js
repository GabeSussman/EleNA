import './App.css';
<<<<<<< HEAD
import {useEffect, useState} from 'react'
import Sidebar from './components/sidebar'
=======
import {useEffect, useState} from 'react';
import Sidebar from './components/sidebar';
import Map from "./components/Map";
import Page from "./components/page";
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";
>>>>>>> howie

function App() {

  const [test, setTest] = useState();


  useEffect(() => {
    fetch("http://localhost:5000/api")
    .then( response => response.json() )
    .then( data => {
      console.log("start")
      setTest(data)
    })
  }, []);

  return (

    <div className="App">
<<<<<<< HEAD
      <Sidebar />
=======
      <Page />
>>>>>>> howie
    </div>

  );
}

export default App;
