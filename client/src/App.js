import './App.css';
import {useEffect, useState} from 'react'
import Map from './Components/Map.js';

function App() {

  const [test, setTest] = useState()

  useEffect(() => {
    fetch("http://localhost:5000/api")
    .then( response => response.json() )
    .then( data => {
      setTest(data)
    })
  }, []);

  return (
    <div>
      <Map/>
    </div>
  );
}

export default App;
