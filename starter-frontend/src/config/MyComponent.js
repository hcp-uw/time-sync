import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import React, { useState, useEffect } from 'react';
import 'firebase/compat/firestore';
import { db } from "./firebase";


// Initialize Firebase (make sure Firebase configuration is loaded from environment variables in the .env file)
// Firebase configuration values such as apiKey, authDomain, and others should be stored in the .env file for security.
// Example: REACT_APP_FIREBASE_API_KEY, REACT_APP_FIREBASE_AUTH_DOMAIN, etc.

const data = {
  name: 'Los Angeles',
  state: 'CA',
  country: 'USA'
};

// Add a new document in collection "cities" with ID 'LA'
const res = await db.collection('cities').doc('LA').set(data);


const MyComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Function to fetch data from Firestore
    const fetchData = async () => {
      const snapshot = await db.collection('movies').get();
      const newData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(newData);
    };

    fetchData(); // Call the function to fetch data when component mounts
    // Clean up function to unsubscribe when component unmounts
    return () => {
      // unsubscribe
    };
  }, []); // Empty dependency array ensures this effect runs only once
  
  /* return (
    <div>
      <h1>Data from Firestore:</h1>
      <ul>
        {data.map(item => (
          <li key={item}>{item.title}</li>
        ))}
        {data.map(item2 => (
          <li key={item2}>{item2.age}</li>
        ))}
      </ul>
    </div>
    
    
  );
  */
};

export default MyComponent;

