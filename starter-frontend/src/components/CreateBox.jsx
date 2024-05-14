import React, { useState } from 'react';
import './CreateBox.css';
import Header from '../components/Header'
import blob1 from '../images/Purple blob.png';
import blob2 from '../images/Green blob.png';
import blob3 from '../images/Purple blob 2.png';
import blob4 from '../images/Purple blob 3.png';
import blob5 from '../images/Green blob 2.png';

import 'firebase/compat/firestore';
import { db } from "../config/firebase.js";


function CreateBox() {
    /*
    State variable to hold the input value (holds the "state" of the input
    must have setInputValue to update the state, is a react thing)
    Have seperate variables to know which input box to display
    */ 
    const [name, setNameValue] = useState('');
    const [showName, setShowName] = useState(true);
    const [eventName, setEventNameValue] = useState('');
    const [showEventName, setShowEventName] = useState(false);
    const [animateNameBox, setAnimateNameBox] = useState(false);

    // Function to handle sync change and update the state
    const handleNameChange = (e) => {
        setNameValue(e.target.value);
    };

    // Function to handle name change and update the state
    const handleEventNameChange = (e) => {
        setEventNameValue(e.target.value);
    };

    // Function to handle button click
    const handleNextButtonClick = async () => {
        // Logic
        if (showName) {
            // Checks for the name entered
            if (name.length > 0) {
                setAnimateNameBox(true);
                setTimeout(() => {
                    setShowName(false);
                    setShowEventName(true);
                }, 500);
            } else {
                alert("Please enter a name of at least 1 character");
            }   
        } else {
            // Checks for the event name entered
            if (eventName.length > 0) {
                const syncCode = await generateUniqueSyncCode();
                // If passes all checks, redirect to calender page after adding data to firebase
                // Upload data to firebase
                await uploadData(syncCode); 
                window.location.href = '/calender' + '?create=true' + '&syncCode=' + syncCode + '&name=' + name + '&create=true';
                // .../calender?create=bool&syncCode=5int&name=string&users=int
            } else {
                alert("Please enter a event name of at least 1 character");
            }
        }
    };

    const generateUniqueSyncCode = async () => {
        // console.log("Uploading data to firebase, data is " + docInfoData);
        let syncCode;
        let codeExists = true;
        while (codeExists) {
            syncCode = Math.floor(10000 + Math.random() * 90000).toString();

            let collectionRef = db.collection(syncCode.toString()); // can hardcode syncCode for testing

            let snapshot = await collectionRef.get();
            if (snapshot.empty) {
                // Collection does not exists, so return
                // console.log(syncCode + " IS UNIQUE");
                codeExists = false;
            } else {
                // Collection does exists, generate new code
                // console.log(syncCode + " IS NOT UNIQUE");
                codeExists = true;
            }
        }
        return syncCode;
    }

    const uploadData = async (syncCode) => {
        const docInfoData = {
            eventName: eventName
        }

        const personData = {
            userName: name,
            calenderData: ["8:00-9:30", "11:00-12:30", "14:00-15:30", "17:00-18:30", "19:30-20:00"]
        };

        console.log("Uploading data to firebase, data is " + docInfoData);

        const collectionRef = await db.collection("20001"); // TEST CODE (20001 is test syncCode data)
        // const collectionRef = db.collection(syncCode.toString()); // REAL CODE

        // For anything through create page, new collection must be created
        collectionRef.doc("Doc Info").set(docInfoData); // Create a Doc Info document to hold all group data
        return collectionRef.doc(name).set(personData);
    }

    return (
        // Div for entire page minus header, will inherit background color
        <div className="allBody">
            <Header />
            <t>Create Page</t>

            <div class="container">
                {showName && (
                    <input type="text" class={`name_enter_box ${animateNameBox ? 'transition_animation_out' : ''}`} placeholder="Your Name" readonly onChange={handleNameChange}></input>
                )}

                {showEventName && (
                    <input type="text" class={`name_enter_box ${animateNameBox ? 'transition_animation_in' : ''}`} placeholder="Event Name" readonly onChange={handleEventNameChange}></input>
                )}


                <button class="next_button" onClick={handleNextButtonClick}>NEXT &gt;&gt;</button>
            </div>
            <img class="blob1" src={blob1}/>
            <img class="blob2" src={blob2}/>
            <img class="blob3" src={blob3}/>
            <img class="blob4" src={blob4}/>
            <img class="blob5" src={blob5}/>
        </div>
        
    );


}

// Backend


export default CreateBox
