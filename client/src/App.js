import './App.css';
import {useEffect, useState} from 'react'
import Sidebar from './components/sidebar'

function App() {

  const [test, setTest] = useState()

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
      <Sidebar />
    </div>
  );
}

export default App;
