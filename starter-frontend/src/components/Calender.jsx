import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Calender.css';
import Header from '../components/Header'
import blob1 from '../images/Purple blob.png';
import blob2 from '../images/Green blob.png';
import blob3 from '../images/Purple blob 2.png';
import blob4 from '../images/Purple blob 3.png';
import blob5 from '../images/Green blob 2.png';

//import 'firebase/compat/firestore';
//import { db } from "./firebase";

import googleCalendar from '../images/googleCalender.png';
import microsoftOutlook from '../images/outlookCalender.png';

function Calender() {
    const currentURL = useLocation();
    const searchParams = new URLSearchParams(currentURL.search);
     // .../calender?create=bool&syncCode=5int&name=string&users=int

    // TODO: change showCreate to be a const
    let showCreate = searchParams.get('create') === 'true';
    showCreate = true;
    const syncCode = searchParams.get('syncCode');
    const name = searchParams.get('name');
    console.log("currnet data on calender is " + showCreate + " " + syncCode + " " + name);

    /*
    State variable to hold the email in the input box
    */
    const [email, setEmailValue] = useState('');

    // Function to handle sync change and update the state
    const handleEmailChange = (e) => {
        setEmailValue(e.target.value);
    };

    // Function to handle button click
    const handleSyncButtonClick = () => {
        // Button logic here, syncCode must be 5 digits and an int
        if (typeof email === 'string' && email.trim() !== '' && email.includes('@')) {
            const randUsers = Math.floor(Math.random() * 10) + 1;
            // If passes all checks, redirect to sync page
            window.location.href = '/sync' + '?create=' + showCreate + '&syncCode=' + syncCode + '&name=' + name + '&users=' + randUsers;
        } else {
            alert("Please enter a valid email address");
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
                        <input type="text" class="sync_code_box" placeholder="Calender Link" readonly onChange={handleEmailChange}></input>
                    </div>
                    <button class="join_button" onClick={handleSyncButtonClick}>Join Sync!</button>
                    </>
                )}

                {/* Conditional for generating sync */}
                {showCreate && (
                    <>
                    <div class="calender_generate_box">
                        <div class="calendar_options">
                            <input type="radio" id="calendar1" name="calendar" checked></input>
                            <label for="calendar1">
                                <img class="calenderImage" src={googleCalendar} alt="Google Calender" />
                            </label>
{/*
                            <input type="radio" id="calendar2" name="calendar"></input>
                            <label for="calendar2">
                                <img class="calenderImage" src={microsoftOutlook} alt="Microsoft Outlook" />
                            </label> */}
                        </div>

                        <input type="text" class="sync_code_box" placeholder="Calender Link" readonly onChange={handleEmailChange}></input>
                        <h2>Duration</h2>

                        {/* TODO: HAVE OPTIONS HERE */}
                        <div class="duration_options">
                            <input type="radio" id="option1" name="duration" value="1day" checked="checked"></input>
                            <label for="option1">1 day</label>

                            {/* <input type="radio" id="option2" name="duration" value="3days"></input>
                            <label for="option2">3 days</label>

                            <input type="radio" id="option3" name="duration" value="7days"></input>
                            <label for="option3">7 days</label> */}
                        </div>
                    </div>
                    <button class="join_button" onClick={handleSyncButtonClick}>Generate!</button>
                    </>
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

export default Calender
