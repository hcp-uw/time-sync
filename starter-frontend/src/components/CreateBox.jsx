import React, { useState } from 'react';
import './CreateBox.css';
import Header from '../components/Header'

function JoinBox() {
    /*
    State variable to hold the input value (holds the "state" of the input
    must have setInputValue to update the state, is a react thing)
    Have seperate variables to know which input box to display
    */ 
    const [name, setNameValue] = useState('');
    const [showName, setShowName] = useState(true);
    const [eventName, setEventNameValue] = useState('');
    const [showEventName, setShowEventName] = useState(false);

    // NEED TO FIGURE OUT EVENT HANDLER FOR NEXT BUTTON

    // Function to handle sync change and update the state
    const handleNameChange = (e) => {
        setNameValue(e.target.value);
    };

    // Function to handle name change and update the state
    const handleEventNameChange = (e) => {
        setEventNameValue(e.target.value);
    };

    // Function to handle button click
    const handleNextButtonClick = () => {
        // Logic
        if (showName) {
            // Checks for the name entered
            if (name.length > 0) {
                setShowName(false);
                setShowEventName(true);
            } else {
                alert("Please enter a name of at least 1 character");
            }  
        } else {
            // Checks for the event name entered
            if (eventName.length > 0) {
                const syncCode = Math.floor(10000 + Math.random() * 90000);
                // If passes all checks, redirect to join page
                window.location.href = '/join' + '?syncCode=' + syncCode + '&name=' + name;
            } else {
                alert("Please enter a event name of at least 1 character");
            }
        }
    };


    return (
        // Div for entire page minus header, will inherit background color
        <div className="allBody">
            <Header />
            <t>Create Page</t>

            <div class="container">
                {showName && (
                    <input type="text" class="name_enter_box" placeholder="Your Name" readonly onChange={handleNameChange}></input>
                )}

                {showEventName && (
                    <input type="text" class="name_enter_box" placeholder="Event Name" readonly onChange={handleEventNameChange}></input>
                )}


                <button class="next_button" onClick={handleNextButtonClick}>NEXT &gt;&gt;</button>
            </div>
        </div>
        
    );
}

export default JoinBox