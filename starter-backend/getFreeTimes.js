const axios = require('axios');

// Your Google Calendar API key (don't put this on github, it's pay to use)
const apiKey = '';

export async function findFreeTime(calendarLink) {
    // Function to extract the calendar ID from a Google Calendar link
    function extractCalendarId(calendarLink) {
        const regex = /src=([^&]+)/;
        const match = calendarLink.match(regex);
        return match ? decodeURIComponent(match[1]) : null;
    }

    // Function to fetch events from a Google Calendar using the Calendar API
    async function fetchCalendarEvents(calendarId, apiKey) {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&singleEvents=true&maxResults=2500`;
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
                // The request was made, and the server responded with a status code outside the 2xx range
                console.error('Error fetching events:', error.response.data);
            } else if (error.request) {
                // The request was made, but no response was received
                console.error('Error: No response received', error.request);
            } else {
                // Something happened in setting up the request
                console.error('Error:', error.message);
            }
            return null;
        }
    }

    // Function to format event details with time in 24-hour format
    function formatEventTime(dateTime) {
        if (!dateTime) {
            return 'Unknown time';
        }

        const options = { hour: '2-digit', minute: '2-digit', hour12: false };
        const formattedTime = new Date(dateTime).toLocaleTimeString('en-US', options);
        return formattedTime !== 'Invalid Date' ? formattedTime : 'Unknown time';
    }

    // Function to calculate free time slots
    function getAvailability(eventTimes) {
        const fullDayStart = 0;
        const fullDayEnd = 24 * 60; // in minutes

        // Convert time to minutes
        function timeToMinutes(time) {
            const [hours, minutes = "00"] = time.split(":").map(Number);
            return hours * 60 + minutes;
        }

        // Convert minutes to time
        function minutesToTime(minutes) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        }

        // Convert event times to minutes
        const eventMinutes = eventTimes.flatMap(event => {
            const [start, end] = event.split('-').map(t => timeToMinutes(t.replace("pm", "")));
            return [[start, end]];
        });

        // Sort events by start time
        eventMinutes.sort((a, b) => a[0] - b[0]);

        // Calculate available time slots
        let availableTimes = [];
        let currentTime = fullDayStart;

        for (let [start, end] of eventMinutes) {
            if (currentTime < start) {
                availableTimes.push([currentTime, start]);
            }
            currentTime = Math.max(currentTime, end);
        }

        // Add remaining time slot till end of day
        if (currentTime < fullDayEnd) {
            availableTimes.push([currentTime, fullDayEnd]);
        }

        // Format available times to strings
        const availableTimesFormatted = availableTimes.map(([start, end]) => {
            return `${minutesToTime(start)}-${minutesToTime(end)}`;
        });

        return availableTimesFormatted;
    }

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
            console.log('Events By Day:');
            Object.entries(eventsByDay).forEach(([day, events]) => {
                console.log(day);
                events.forEach(event => {
                    console.log(`  ${event}`);
                });
            });

            const currentDate = new Date().toLocaleDateString('en-US');
            const date = new Date(currentDate);
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const dayIndex = date.getDay();
            const dayName = dayNames[dayIndex];

            // Get the event times of the current day
            const eventsToday = eventsByDay[currentDate] || [];

            console.log("Current Date: " + dayName + " - " + currentDate);
            console.log('Events Today:', eventsToday);

            // Print array of free times 
            console.log('Free Times Today:', getAvailability(eventsToday));

        } else {
            console.log('Failed to fetch events or no events found.');
        }
    } else {
        console.log('Failed to extract calendar ID from the link.');
    }
}

// Example usage
const calendarLink = 'https://calendar.google.com/calendar/embed?src=hfkcspg4u31mb4kph4h22dogoc%40group.calendar.google.com&ctz=America%2FLos_Angeles';
findFreeTime(calendarLink);
