import React, { useState } from 'react';
import './JoinBox.css';
import Header from '../components/Header'

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
    const handleSyncButtonClick = () => {
        // Button logic here, syncCode must be 5 digits and an int
        if (!isNaN(syncCode) && syncCode.length == 5 && Number.isInteger(parseInt(syncCode, 10))) {
            setShowSyncCode(false);
            setShowName(true);
        } else {
            alert("Please enter a valid 5 digit Sync Code, currently the syncCode is: " + syncCode);
        }
    };

    // Function to handle button click
    const handleNameButtonClick = () => {
        // Checks for the name entered
        if (name.length > 0) {
            // If passes all checks, redirect to join page
            // window.location.href = '/join' + '?syncCode=' + syncCode + '&name=' + name;
            window.location.href = '/calender' + '?syncCode=' + syncCode + '&name=' + name + '&create=false';
        } else {
            alert("Please enter a name of at least 1 character");
        }        
    };

    return (
        // Div for the entire page besides header
        <div className="allBody">
            <Header />
            {/* Text at top of page */}
            <t>Join Page</t>
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
        </div>
        
    );
}

export default JoinBox
