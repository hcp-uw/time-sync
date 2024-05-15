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

function Sync() {

    return (
        <div className="allBody">
            <Header />
            <div id="sync-page-wrapper">
                <section id="event-info">
                    <h1 id="event-name">HCP</h1>
                    <div id="availability-meter">
                    <div class="event meter-0"></div>
                    <div class="event meter-1"></div>
                    <div class="event meter-2"></div>
                    <div class="event meter-3"></div>
                    <div class="event meter-4"></div>
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
                        <div class="day">
                            <div class="date-title">
                                <p class="date-num">14</p>
                                <p class="date-day">Tues</p>
                            </div>
                            <div class="events">
                                <div class="event start-1000 end-1130"></div>
                                <div class="event start-1100 end-1130"></div>
                                <div class="event start-1230 end-1445"></div>
                                <div class="event start-1230 end-1400"></div>
                                <div class="event start-1530 end-1715"></div>
                                <div class="event start-1530 end-1645"></div>
                                <div class="event start-1830 end-2000"></div>
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
                    <div class="user">
                    <img src={freeUser} alt="user-1 status"/>
                    <div>
                        <p class="user-name">Andrew Chen</p>
                        <h2 class="user-status">FREE</h2>
                    </div>
                    </div>
                    <div class="user">
                    <img src={busyUser} alt="user-2 status"/>
                    <div>
                        <p class="user-name">Victor Liu</p>
                        <h2 class="user-status">BUSY</h2>
                    </div>
                    </div>
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
