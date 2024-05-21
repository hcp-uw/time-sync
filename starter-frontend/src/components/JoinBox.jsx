import React, { useState } from 'react';
import './JoinBox.css';
import Header from '../components/Header'
import blob1 from '../images/Purple blob.png';
import blob2 from '../images/Green blob.png';
import blob3 from '../images/Purple blob 2.png';
import blob4 from '../images/Purple blob 3.png';
import blob5 from '../images/Green blob 2.png';


import 'firebase/compat/firestore';
import { db } from "../config/firebase.js";

function JoinBox() {
    /*
    State variable to hold the input value (holds the "state" of the input
    must have setInputValue to update the state, is a react thing)
    Have seperate variables to know which input box to display
    */
    const [syncCode, setSyncCodeValue] = useState('');
    const [showSyncCode, setShowSyncCode] = useState(true);
    const [name, setNameValue] = useState('');
    const [showName, setShowName] = useState(false);

    // Function to handle sync change and update the state
    const handleSyncChange = (e) => {
        setSyncCodeValue(e.target.value);
    };

    // Function to handle name change and update the state
    const handleNameChange = (e) => {
        setNameValue(e.target.value);
    };

    // Function to handle button click
    const handleSyncButtonClick = async () => {
        // Button logic here, syncCode must be 5 digits and an int
        if (!isNaN(syncCode) && syncCode.length == 5 && Number.isInteger(parseInt(syncCode, 10))) {
            if (await checkSyncCodeExists(syncCode)) {
                setShowSyncCode(false);
                setShowName(true);
            } else {
                alert("The " + syncCode + " SyncCode currently does not exist! Please enter a valid 5 digit SyncCode or create a SyncCode.");
            }
        } else {
            alert("Please enter a valid 5 digit Sync Code, currently the SyncCode is: " + syncCode);
        }
    };

    const checkSyncCodeExists = async (syncCode) => {
        console.log("syncCode entered: " + syncCode);
        let collectionRef = db.collection(syncCode.toString()); // can hardcode syncCode for testing

        let snapshot = await collectionRef.get();
        if (snapshot.empty) {
            // console.log("syncCode does not exist");
            return false; // syncCode does not exist
        } else {
            // console.log("syncCode exists");
            return true; // syncCode exists
        }
    }

    // Function to handle button click
    const handleNameButtonClick = async () => {
        // Checks for the name entered
        if (name.length > 0) {
            await uploadData(); // Might not have to be async but oh oh well :P

            // If passes all checks, redirect to calender page
            window.location.href = '/calender' + '?create=false' + '&syncCode=' + syncCode + '&name=' + name + '&create=true';
            // .../calender?create=bool&syncCode=5int&name=string&users=int
        } else {
            alert("Please enter a name of at least 1 character");
        }
    };

    const uploadData = async () => {
        // The data uploaded for each person to Firebase
        const personData = {
            userName: name,
            calenderData: ["09:45-11:15", "12:00-13:00", "15:00-16:15", "20:30-23:00"]
        };

        const collectionRef = await db.collection(syncCode.toString()); // TEST CODE (20001 is test syncCode data)

        // We know syncCode is a collection that exists, we are simply adding a document for a new person
        return collectionRef.doc(name).set(personData);
    }

    return (
        // Div for the entire page besides header
        <div className="allBody">
            <Header />
            {/* Text at top of page */}
            {/* <t>Join Page</t> */}
            {/* Div for overall centered box */}
            <div class="container">
                {/* Title */}
                <h2 class="sync_title"> Let's Sync it up!</h2>

                {/* Add a divider between sync box and name box, both are conditionals */}
                {/* Div for sync code box with input and button */}
                {showSyncCode && (
                    <div class="box">
                    <input type="text" class="sync_code_box" placeholder="Sync Code" readonly onChange={handleSyncChange}></input>
                    <button class="enter_button" onClick={handleSyncButtonClick}>Enter</button>
                    </div>
                )}

                {/* Div for name box with input and button */}
                {showName && (
                    <div class="box">
                    <input type="text" class="sync_code_box" placeholder="Your Name" readonly onChange={handleNameChange}></input>
                    <button class="enter_button" onClick={handleNameButtonClick}>OK, go!</button>
                    </div>
                )}

            </div>
            <img class="blob1" src={blob1}/>
            <img class="blob2" src={blob2}/>
            <img class="blob3" src={blob3}/>
            <img class="blob4" src={blob4}/>
            <img class="blob5" src={blob5}/>
        </div>

    );
}

export default JoinBox
