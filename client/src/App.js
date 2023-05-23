import './App.css';
import {useEffect, useState} from 'react';
import Page from "./comps/page";
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";

function App() {

  const [test, setTest] = useState();


  // useEffect(() => {
  //   fetch("http://localhost:5000/api")
  //   .then( response => response.json() )
  //   .then( data => {
  //     console.log("start")
  //     setTest(data)
  //   })
  // }, []);

  return (

    <div className="App">
      <Page />
    </div>

  );
}

export default App;
