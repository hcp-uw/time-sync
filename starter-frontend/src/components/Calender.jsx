/* global doc, setDoc */

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Calender.css';
import Header from '../components/Header'
import blob1 from '../images/Purple blob.png';
import blob2 from '../images/Green blob.png';
import blob3 from '../images/Purple blob 2.png';
import blob4 from '../images/Purple blob 3.png';
import blob5 from '../images/Green blob 2.png';

import axios from 'axios';

import TestFreeTimes from '../config/CalendarAvailability';

import googleCalendar from '../images/googleCalender.png';
import microsoftOutlook from '../images/outlookCalender.png';

import { db } from "../config/firebase.js";



function Calender() {
    const currentURL = useLocation();
    const searchParams = new URLSearchParams(currentURL.search);
     // .../calender?create=bool&syncCode=5int&name=string&users=int

    // TODO: change showCreate to be a const
    const showCreate = searchParams.get('create') === 'true';
    // showCreate = true;
    const syncCode = searchParams.get('syncCode');
    const name = searchParams.get('name');
    console.log("currnet data on calender is " + showCreate + " " + syncCode + " " + name);

    /*
    State variable to hold the email in the input box
    */
    const [email, setEmailValue] = useState('');
    const [freeTimes, setFreeTimes] = useState([]);

    // Function to handle sync change and update the state
    const handleEmailChange = (e) => {
        setEmailValue(e.target.value);
    };

    // Function to handle button click
    const handleSyncButtonClick = async () => {
        // Button logic here, email must have an @
        if (typeof email === 'string' && email.trim() !== '' && email.startsWith('https://calendar.google.com/calendar/embed?src=')) {
            console.log("email submitted was: " + email);
            await uploadCalendarData(email);

            // const freeTimes = await findFreeTime(email);
            // console.log("freeTimes: " + freeTimes);
            // If passes all checks, redirect to sync page
            window.location.href = '/sync' + '?create=' + showCreate + '&syncCode=' + syncCode + '&name=' + name;
        } else {
            alert("Please enter a valid email address");
        }
    };

    // HERE IS ALL THE API/BACKEND CODE FOR FETCHING CALENDAR DATA
    // DIVIDER DIVIDER REMEMBER BACKEND
    const apiKey = 'AIzaSyCFivIUfU4Hi4eepo2z5etJkpHvgdEnh6s';
    const uploadCalendarData = async () => {
        const calendarId = extractCalendarId(email);
        if (calendarId) {
            const eventsData = await fetchCalendarEvents(calendarId, apiKey);
            if (eventsData && eventsData.items) {
                const eventsByDay = {};
                eventsData.items.forEach(event => {
                    if (event.start && event.start.dateTime) {
                        const date = new Date(event.start.dateTime).toLocaleDateString('en-US');
                        const timeRange = `${formatEventTime(event.start.dateTime)}-${formatEventTime(event.end.dateTime)}`;
                        if (!eventsByDay[date]) {
                            eventsByDay[date] = [];
                        }
                        eventsByDay[date].push(timeRange);
                    }
                });

                const currentDate = new Date().toLocaleDateString('en-US');
                const eventsToday = eventsByDay[currentDate] || [];

                setFreeTimes(getAvailability(eventsToday));
                
                console.log("updatedFIrebase maybe");

                console.log("freetimes: " + freeTimes);

                // Update Firebase with freeTimes
                updateFirebaseWithFreeTimes();
                return;
            } else {
                console.log('Failed to fetch events or no events found.');
                return;
            }
        } else {
            console.log('Failed to extract calendar ID from the link, ' + email);
            return;
        }
    };

    const extractCalendarId = (calendarLink) => {
        const regex = /src=([^&]+)/;
        const match = calendarLink.match(regex);
        return match ? decodeURIComponent(match[1]) : null;
    };

    const fetchCalendarEvents = async (calendarId, apiKey) => {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&singleEvents=true&maxResults=2500`;
        console.log("calenderID: " + calendarId + " and apiKey: " + apiKey);
        try {
            const response = await axios.get(url);
            if (response.status === 200) {
                return response.data;
            } else {
                console.error('Error: Unexpected response status', response.status);
                return null;
            }
        } catch (error) {
            if (error.response) {
                console.error('Error fetching events:', error.response.data);
            } else if (error.request) {
                console.error('Error: No response received', error.request);
            } else {
                console.error('Error:', error.message);
            }
            return null;
        }
    };

    const formatEventTime = (dateTime) => {
        if (!dateTime) {
            return 'Unknown time';
        }

        const options = { hour: '2-digit', minute: '2-digit', hour12: false };
        const formattedTime = new Date(dateTime).toLocaleTimeString('en-US', options);
        return formattedTime !== 'Invalid Date' ? formattedTime : 'Unknown time';
    };

    const getAvailability = (eventTimes) => {
        const fullDayStart = 0;
        const fullDayEnd = 24 * 60; // in minutes

        const timeToMinutes = (time) => {
            const [hours, minutes = "00"] = time.split(":").map(Number);
            return hours * 60 + minutes;
        };

        const minutesToTime = (minutes) => {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        };

        const eventMinutes = eventTimes.flatMap(event => {
            const [start, end] = event.split('-').map(t => timeToMinutes(t.replace("pm", "")));
            return [[start, end]];
        });

        eventMinutes.sort((a, b) => a[0] - b[0]);

        let availableTimes = [];
        let currentTime = fullDayStart;

        for (let [start, end] of eventMinutes) {
            if (currentTime < start) {
                availableTimes.push([currentTime, start]);
            }
            currentTime = Math.max(currentTime, end);
        }

        if (currentTime < fullDayEnd) {
            availableTimes.push([currentTime, fullDayEnd]);
        }

        return availableTimes.map(([start, end]) => {
            return `${minutesToTime(start)}-${minutesToTime(end)}`;
        });
    };

    const updateFirebaseWithFreeTimes = async () => {
        try {
            // const docRef = doc(db, '20001', 'Vic');
            // await setDoc(docRef, { CalendarData: freeTimes }, { merge: true });
            // console.log('Firebase updated successfully');
            //const collectionRef = await db.collection(syncCode.toString());
            const collectionRef = await db.collection("20001");
            collectionRef.doc(name).set({ calenderData: freeTimes }, { merge: true });
        } catch (error) {
            console.error('Error updating Firebase:', error);
        }
    };

    
    // RETURN FUNCTION FOR RENDERING
    return (
        // Div for the entire page besides header
        <div className="allBody">
            <TestFreeTimes calendarLink={email} />
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
                        {/*
                        <a href="https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook">
                            <img class="calenderImage" src={microsoftOutlook} alt="Microsoft Outlook" />
                        </a>
                        */}
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
