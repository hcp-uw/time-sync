import styles from './App.css';

import Join from './pages/Join';
import Create from './pages/Create';

import { Route, Routes } from 'react-router-dom';

import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const baseURL = 'http://localhost:3001';

function App() {
  // My guess/interpretation is this is for linking with backend and fetching data
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

  // Here begins actual front end

  return (
    <>
      <Routes>
        <Route path="/" element={<Join />} /> 
        <Route path="/join" element={<Join />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </>
  );
}

export default App;


