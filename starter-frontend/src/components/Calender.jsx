import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Calender.css';
import Header from '../components/Header'

import googleCalendar from '../images/googleCalender.png';
import microsoftOutlook from '../images/outlookCalender.png';

function Calender() {
    const currentURL = useLocation();
    const searchParams = new URLSearchParams(currentURL.search);
    // TODO: change showCreate to be a const
    let showCreate = searchParams.get('create') === 'true';
    // showCreate = false;

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
            window.location.href = '/join' + '?syncCode=' + syncCode + '&name=' + name;
        } else {
            alert("Please enter a name of at least 1 character");
        }        
    };

    return (
        // Div for the entire page besides header
        <div className="allBody">
            <Header />
            {/* Text at top of page */}
            <t>Calender Page</t>

            {/* Div for overall centered box */}
            <div class="container">
                {/* Title */}
                <h2 class="sync_title"> Let's Calender dis hoe up in here!</h2>

                {/* Conditional for joining sync */}
                {console.log("showCreate: " + showCreate)}
                {!showCreate && (
                    <>
                    <div class="calender_join_box">
                        <a href="https://workspace.google.com/products/calendar/?hl=en-US">
                            <img class="calenderImage" src={googleCalendar} alt="Google Calender" />
                        </a>
                        <a href="https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook">
                            <img class="calenderImage" src={microsoftOutlook} alt="Microsoft Outlook" />                        
                        </a>
                        <input type="text" class="sync_code_box" placeholder="Calender Link" readonly onChange={handleSyncChange}></input>
                    </div>
                    <button class="join_button" onClick={handleSyncButtonClick}>Join Sync!</button>
                    </>
                )}

                {/* Conditional for generating sync */}
                {showCreate && (
                    <>
                    <div class="calender_generate_box">
                        <a href="https://workspace.google.com/products/calendar/?hl=en-US">
                            <img class="calenderImage" src={googleCalendar} alt="Google Calender" />
                        </a>
                        <a href="https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook">
                            <img class="calenderImage" src={microsoftOutlook} alt="Microsoft Outlook" />                        
                        </a>
                        <input type="text" class="sync_code_box" placeholder="Calender Link" readonly onChange={handleSyncChange}></input>
                        <h2>Duration</h2>

                        {/* TODO: HAVE OPTIONS HERE */}
                        <div class="options">
                            <label for="option1">1 day</label>
                            <input type="radio" id="option1" name="duration" value="1day"></input>

                            <label for="option2">3 days</label>
                            <input type="radio" id="option2" name="duration" value="3days"></input>

                            <label for="option3">7 days</label>
                            <input type="radio" id="option3" name="duration" value="7days"></input>
                        </div>
                    </div>
                    <button class="join_button" onClick={handleSyncButtonClick}>Generate!</button>
                    </>
                )}
                
            </div>
        </div>
        
    );
}

export default Calender
