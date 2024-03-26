import styles from './App.css';

import Join from './pages/Join';
import Create from './pages/Create';
import Calender from './pages/Calender';
import Sync from './pages/Sync';

import { Route, Routes } from 'react-router-dom';

import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const baseURL = 'http://localhost:3001';

/**
 * App is the root component of the frontend
 * - It fetches data from the backend on mount
 * - It renders the main navbar and Routes of the frontend
 */
function App() {
  // Message is the data fetched from the backend on mount
  // My guess/interpretation is this is for linking with backend and fetching data
  const [message, setMessage] = useState('');

  // Fetch data from backend on mount
  useEffect(() => {
    // Make a GET request to the backend with the path /hello
    axios.get(`${baseURL}/hello`)
      .then(res => {
        // Set the response data as the message state
        setMessage(res.data); 
      })
      .catch(error => {
        // Log the error to the console
        console.error('error fetching data: ', error);
      });
  }, []); // The empty array [] as the second argument to useEffect makes this only run on mount

  // Log the message to the console
  console.log(message);

  // Render the main navbar and Routes of the frontend
  return (
    <>
      {/* JSX comment */}
      <Routes>
        {/* The path "/" and "/join" share the same element (<Join />) */}
        <Route path="/" element={<Join />} /> 
        <Route path="/join" element={<Join />} />
        <Route path="/create" element={<Create />} />
        <Route path="/calender" element={<Calender />} />
        <Route path="/sync" element={<Sync />} />
      </Routes>
    </>
  );
}

export default App;


