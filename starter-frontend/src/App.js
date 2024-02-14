import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const baseURL = 'http://localhost:3001';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`${baseURL}/hello`)
      .then(res => {
        setMessage(res.data); 
      })
      .catch(error => {
        console.error('error fetching data: ', error);
      });
  }, []); 

  console.log(message);
  return (
    <>
      <h1>Hello, HCP. We are going to sync you in places you did not know before.</h1>
      <p>{message}</p>

    </>
  );
}

export default App;
