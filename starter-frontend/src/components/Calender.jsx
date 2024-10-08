/* global doc, setDoc */

import React, { useState, useEffect } from 'react';
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
import demo from '../images/calendar_demo.gif'

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
    // const [email, setEmailValue] = useState('');
    let email = "";

    // Function to handle sync change and update the state

    const handleEmailChange = (e) => {
        email = "";
        email = e.target.value;
        console.log("email = " + email);
    };

    // Function to handle button click
    const handleSyncButtonClick = async () => {
        // Button logic here, email must have an @
        if (typeof email === 'string' && email.trim() !== '' && email.startsWith('https://calendar.google.com/calendar/embed?src=')){
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
    const apiKey = process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY;
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
                // console.log("AHHHHHH " + eventsToday);

                // const handleUpdateFreeTimes = () => {
                const newFreeTimes = getAvailability(eventsToday);
                console.log("New freeTimes: " + newFreeTimes);
                updateFirebaseWithFreeTimes(newFreeTimes);
                // };

                // handleUpdateFreeTimes();

                // Update Firebase with freeTimes
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

        const roundUpToNearest15 = (minutes) => {
            return Math.ceil(minutes / 15) * 15;
        };

        const roundDownToNearest15 = (minutes) => {
            return Math.floor(minutes / 15) * 15;
        };      

        const eventMinutes = eventTimes.flatMap(event => {
            const [start, end] = event.split('-').map(t => timeToMinutes(t.replace("pm", "")));
            return [[start, end]];
        });

        eventMinutes.sort((a, b) => a[0] - b[0]);

        let availableTimes = [];
        let currentTime = fullDayStart;

        for (let [start, end] of eventMinutes) {
            start = roundDownToNearest15(start);  // Ensure free time starts after the rounded start time
            if (currentTime < start) {
                availableTimes.push([currentTime, start]);
            }
            currentTime = Math.max(currentTime, roundUpToNearest15(end));  // Ensure free time starts after the rounded end time
        }

        if (currentTime < fullDayEnd) {
            availableTimes.push([currentTime, fullDayEnd]);
        }

        return availableTimes.map(([start, end]) => {
            return `${minutesToTime(start)}-${minutesToTime(end)}`;
        });
    };

    const updateFirebaseWithFreeTimes = async (freeTimes) => {
        try {
            // const docRef = doc(db, '20001', 'Vic');
            // await setDoc(docRef, { CalendarData: freeTimes }, { merge: true });
            // console.log('Firebase updated successfully');
            const collectionRef = await db.collection(syncCode.toString());
            // const collectionRef = await db.collection("20001");
            collectionRef.doc(name).set({ calenderData: freeTimes }, { merge: true });
        } catch (error) {
            console.error('Error updating Firebase:', error);
        }
    };

    /* ------- Frontend UI Stuff --------- */

    useEffect(() => {
        let helperIcon = document.querySelector(".helper_icon");
        let helperGif = document.querySelector(".helper_gif");
        helperIcon.addEventListener("mouseover", () => {
            helperGif.classList.remove("hidden");
        });

        helperIcon.addEventListener("mouseout", () => {
            helperGif.classList.add("hidden");
        });
    }, []);


    // RETURN FUNCTION FOR RENDERING
    return (
        // Div for the entire page besides header
        <div className="allBody">
            <TestFreeTimes calendarLink={email} />
            <Header />
            {/* Text at top of page */}
            {/* <t>Calender Page</t> */}

            {/* Div for overall centered box */}
            <div class="container">
                {/* Title */}
                {/*<h2 class="sync_title"> Let's Calender dis hoe up in here!</h2>*/}

                {/* Conditional for joining sync */}
                {console.log("showCreate: " + showCreate)}
                {!showCreate && (
                    <>
                    <div class="calender_join_box">
                        <svg class="helper_icon" xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#e8eaed"><path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                        <img class="helper_gif hidden" src={demo} />
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
                        <svg class="helper_icon" xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#e8eaed"><path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                        <img class="helper_gif hidden" src={demo} />
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
