import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Sync.css';
import './SyncTimes.css'
import Header from '../components/Header'
import blob1 from '../images/Purple blob.png';
import blob2 from '../images/Green blob.png';
import blob3 from '../images/Purple blob 2.png';
import blob4 from '../images/Purple blob 3.png';
import blob5 from '../images/Green blob 2.png';
import busyUser from '../images/busyUser.png';
import freeUser from '../images/freeUser.png';

import 'firebase/compat/firestore';
import { db } from "../config/firebase.js";

function Sync() {

    let eventName = "";

    const [data, setData] = useState([]);
    const currentURL = useLocation();
    const searchParams = new URLSearchParams(currentURL.search);
    const syncCode = searchParams.get('syncCode');
    const [prevEventCount, setPrevEventCount] = useState(null);

    /**
     * Fuction used to fetch data and update the module-global constant holding the data
     */
    useEffect(() => {
        const fetchData = async () => {
            const snapshot = await db.collection(syncCode).get();
            // const snapshot = await db.collection("84951").get();
            const newData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(newData);
        };
        fetchData();
    }, []);

    /**
     * Function to generate all user events when data is updated
     */
    useEffect(() => {
        qs(".day-1 .events").innerHTML = "";

        data.forEach(el => {
            if (el.id !== "Doc Info") {
                generateUserEvents(el.calenderData, el.userName);
                generateUserProfile(el.userName);
            }
        });
        generateMeter();

    }, [data]);

    /**
     * Function to update "syncd-up" section when event hovered changes
     */
    useEffect(() => {
        // id("days").removeEventListener("mousemove", handleMouseOver);
        id("days").addEventListener("mousemove", handleMouseOver);
        return () => {
            if (id("days")) {
                id("days").removeEventListener("mousemove", handleMouseOver);
            }
        }
    }, [prevEventCount]);


    /* ------- UPDATING EVENT NAME ------- */
    data.forEach(el => {
        if (el.id === "Doc Info") {
            eventName = el.eventName;
        }
    });
    /* ------- UPDATING EVENT NAME ------- */


    function handleMouseOver(evt) {
        const mouseX = evt.clientX;
        const mouseY = evt.clientY;
        const mouseHovered = document.elementsFromPoint(mouseX, mouseY);
        const eventStack = mouseHovered.filter(element => element.classList.contains("event"));
        const eventCount = eventStack.length;

        if (eventCount !== prevEventCount) {
            setPrevEventCount(eventCount);
            let freeUsers = [];
            eventStack.forEach(event => {
                freeUsers.push(event.id);
            });
            updateUserStatus(freeUsers);
        }
    }

    function generateMeter() {
        const parent = id("availability-meter")
        // const r = qs(":root");
        // r.style.setProperty('--maxSync', data.length);
        document.documentElement.style.setProperty('--maxSync', data.length);
        for (let i = 1; i < data.length; i++) {
            let unit = gen("div");
            unit.classList.add("event");
            unit.classList.add("meter-" + i);
            unit.textContent = i;
            parent.appendChild(unit);
        }
    }

    function updateUserStatus(freeUsers) {
        qsa("#syncd-users > div").forEach(userProfile => {
            if (freeUsers.includes(userProfile.id)){
                userProfile.classList.remove("busy");
                userProfile.querySelector("img").src = freeUser;
                userProfile.querySelector("h2").textContent = "FREE";
            } else {
                userProfile.classList.add("busy");
                userProfile.querySelector("img").src = busyUser;
                userProfile.querySelector("h2").textContent = "BUSY";
            }
        });
    }

    function generateUserProfile(username) {
        let parent = id("syncd-users");
        let userProfile = gen("div");
        let statusImg = gen("img");
        let userDetails = gen("div");
        let name = gen("p");
        let status = gen("h2");
        status.classList.add("user-status");
        status.textContent = "BUSY";
        name.classList.add("user-name");
        name.textContent = username;
        userDetails.appendChild(name);
        userDetails.appendChild(status);
        statusImg.src = busyUser;
        userProfile.appendChild(statusImg);
        userProfile.appendChild(userDetails);
        userProfile.classList.add("user");
        userProfile.classList.add("busy");
        userProfile.id = username;
        parent.append(userProfile);
    }

    function generateUserEvents(calendarData, username) {
        let formattedCalData = convertCalendarData(calendarData);
        let parent = qs(".day-1 .events");
        formattedCalData.forEach(timeRange => {
            let [start, end] = timeRange.split(" ");
            let event = gen("div");
            event.classList.add("event");
            event.classList.add(start);
            event.classList.add(end);
            event.id = username;
            parent.appendChild(event);
        })
    }

    function convertCalendarData(calendarData) {
        let output = [];
        calendarData.forEach(timeRange => {
            let [start, end] = timeRange.split("-");
            start = "start-" + start.replace(":", "");
            end = "end-" + end.replace(":", "");
            output.push(start + " " + end);
        });
        // console.log(output);
        return output;
    }

    /**
     * shortcut for getElementById
     * @param {string} id - ID of the element to be accessed
     * @returns {element} - Element that has the given ID
     */
    function id(id) {
        return document.getElementById(id);
    }

    /**
     * shortcut for querySelector
     * @param {string} selector - selector of the element to be accessed
     * @returns {element} - Element that corresponds to the selector given
     */
    function qs(selector) {
        return document.querySelector(selector);
    }

    /**
     * shortcut for querySelectorAll
     * @param {string} selector - selector of the elements to be accessed
     * @returns {array} - Array of elements that corresponds to the selector given
     */
    function qsa(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * shortcut for createElement
     * @param {string} newTag - name of tag to be created
     * @returns {element} - a newly created element with the given newTag
     */
    function gen(newTag) {
        return document.createElement(newTag);
    }


    return (
        <div className="allBody">
            <Header />
            <div id="sync-page-wrapper">
                <section id="event-info">
                    <h1 id="event-name">{eventName}</h1>
                    <h2 id="sync-code">Sync Code: <span>{syncCode}</span></h2>
                    <div id="availability-meter">
                        <div class="event meter-0">0</div>
                        {/* <div class="event meter-1">1</div>
                        <div class="event meter-2">2</div>
                        <div class="event meter-3">3</div>
                        <div class="event meter-4"></div> */}
                    </div>
                </section>
                <section id="calendar">
                    <section id="timeline">
                    <div class="time-marker" id="spacer">PST</div>
                    <div class="time-marker">5 AM</div>
                    <div class="time-marker">6 AM</div>
                    <div class="time-marker">7 AM</div>
                    <div class="time-marker">8 AM</div>
                    <div class="time-marker">9 AM</div>
                    <div class="time-marker">10 AM</div>
                    <div class="time-marker">11 AM</div>
                    <div class="time-marker">12 PM</div>
                    <div class="time-marker">1 PM</div>
                    <div class="time-marker">2 PM</div>
                    <div class="time-marker">3 PM</div>
                    <div class="time-marker">4 PM</div>
                    <div class="time-marker">5 PM</div>
                    <div class="time-marker">6 PM</div>
                    <div class="time-marker">7 PM</div>
                    <div class="time-marker">8 PM</div>
                    <div class="time-marker">9 PM</div>
                    <div class="time-marker">10 PM</div>
                    <div class="time-marker">11 PM</div>
                    </section>
                    <section id="days">
                        <div class="day-1">
                            <div class="date-title">
                                <p class="date-num">21</p>
                                <p class="date-day">Mon</p>
                            </div>
                            <div class="events">
                            </div>
                        </div>
                        {/* <div class="day">
                                <div class="date-title">
                                <p class="date-num">15</p>
                                <p class="date-day">Wed</p>
                            </div>
                            <div class="events">
                                <div class="event start-1330 end-1830"></div>
                                <div class="event start-14 end-17"></div>
                                <div class="event start-1515 end-16"></div>
                                <div class="event start-18 end-19"></div>
                            </div>
                        </div> */}
                    </section>
                </section>
                <section id="syncd-up">
                    <h1>Sync'd Up!</h1>
                    <div id="syncd-users"></div>
                    <div id="user-spacer"></div>
                </section>
            </div>
            <img class="blob1" src={blob1}/>
            <img class="blob2" src={blob2}/>
            <img class="blob3" src={blob3}/>
            <img class="blob4" src={blob4}/>
            <img class="blob5" src={blob5}/>
        </div>
    );
}

export default Sync
