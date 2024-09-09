// FILE NOT USED AT ALL (but is the jsx version of getFreeTimes.js)

/* global doc, setDoc, getDoc */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

import 'firebase/compat/firestore';
import { db } from "../config/firebase.js";

const CalendarAvailability = ({}) => {
    const [freeTimes, setFreeTimes] = useState([]);
    const [calendarLink, setCalendarLink] = useState('');
    const apiKey = process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY;

    useEffect(() => {
        const fetchData = async () => {
            const calendarId = extractCalendarId(calendarLink);
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

                    // Update Firebase with freeTimes
                    updateFirebaseWithFreeTimes();
                } else {
                    console.log('Failed to fetch events or no events found.');
                }
            } else {
                console.log('Failed to extract calendar ID from the link, ' + calendarLink);
            }
        };

        fetchData();
    }, [calendarLink]);

    useEffect(() => {
        const fetchCalendarLink = async () => {
            try {
                const docRef = await getDoc(doc(db, '12345', 'vic'));
                if (docRef.exists()) {
                    const data = docRef.data();
                    setCalendarLink(data.emailLink);
                    console.log('Calendar link fetched successfully:', data.emailLink);
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        };

        fetchCalendarLink();
    }, []);

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
            const docRef = doc(db, '12345', 'vic');
            await setDoc(docRef, { CalendarData: freeTimes }, { merge: true });
            console.log('Firebase updated successfully');
        } catch (error) {
            console.error('Error updating Firebase:', error);
        }
    };

    return null;
};

export default CalendarAvailability;
