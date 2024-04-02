import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Sync.css';
import Header from '../components/Header'
import blob1 from '../images/Purple blob.png';
import blob2 from '../images/Green blob.png';
import blob3 from '../images/Purple blob 2.png';
import blob4 from '../images/Purple blob 3.png';
import blob5 from '../images/Green blob 2.png';

import googleCalendar from '../images/googleCalender.png';
import microsoftOutlook from '../images/outlookCalender.png';

function Sync() {
    const currentURL = useLocation();
    const searchParams = new URLSearchParams(currentURL.search);
                    // .../calender?create=bool&syncCode=5int&name=string&users=int

    // TODO: change showCreate to be a const
    //let showCreate = searchParams.get('create') === 'true';
    //const syncCode = searchParams.get('syncCode');
    //const name = searchParams.get('name');
    //const users = searchParams.get('users');
    //console.log("current data is " + showCreate + " " + syncCode + " " + name + " " + users);
    // showCreate = false;

    const [showCreate, setShowCreate] = useState(searchParams.get('create') === 'true');
    const [syncCode, setSyncCode] = useState(searchParams.get('syncCode'));
    const [name, setName] = useState(searchParams.get('name'));
    const [users, setUsers] = useState(searchParams.get('users'));

    
    const [calenderData, setCalenderData] = useState(Array.from({ length: 24 }, () => Array(60).fill(0))); // Initialize sum as a 2D array of [24][60] filled with 0s
    const [isInitialized, setIsInitialized] = useState(false);

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayOfWeek = daysOfWeek[new Date().getDay()];

    
    const initializeCalendar = () => {
        let sumArray = Array.from({ length: 24 }, () => Array(60).fill(0)); // Initialize sum as a 2D array of [24][60] filled with 0s

        for (let i = 0; i < users; i++) {
            const randomCalender = fill2DArray();
            sumArray = sumArray.map((row, i) => row.map((val, j) => val + randomCalender[i][j]));
        }

        setCalenderData(sumArray);
        setIsInitialized(true);
    }

    const fill2DArray = () => {
        const array = [];
        for (let i = 0; i < 24; i++) {
            const row = [];
            let blockValue = Math.floor(Math.random() * 2); // Generate a random value for the block
            for (let j = 0; j < 60; j++) {
                // Fill the block with the same value
                row.push(blockValue);
                // Change the block value every 5 elements
                if ((j + 1) % 5 === 0) {
                    blockValue = Math.floor(Math.random() * 2);
                }
            }
            array.push(row);
        }
        return array;
    };

    useEffect(() => {
        if (!isInitialized) {
            initializeCalendar();
        } else {
            console.log("rerender");
            console.log("calender data is " + calenderData);
            console.log();
        }
    }, []);


    return (
        // Div for the entire page besides header
        <div className="allBody">
            <Header />
            {/* Text at top of page */}
            <t>Sync Page</t>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gridGap: '2px' }}>
            <div style={{ display: 'grid', gridTemplateRows: 'repeat(24, 300px)', gridGap: '0', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
                {calenderData.map((row, rowIndex) => (
                    <div key={`hour-${rowIndex}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {rowIndex}
                    </div>
                ))}
            </div>
                <div style={{ display: 'grid', gridTemplateRows: 'repeat(60, 5px)', gridGap: '0', gridTemplateColumns: '300px' }}>
                {calenderData.map((row, rowIndex) => (
                    row.map((value, colIndex) => (
                        <div
                            key={`cell-${rowIndex}-${colIndex}`}
                            style={{
                                width: '300px',
                                height: '5px',
                                backgroundColor: `rgba(0, 0, 0, ${value / users})`,
                            }}
                        />
                    ))
                ))}
                    {Array.from({ length: 1 }, (_, i) => (
                        <div key={`hour-label-${i}`} style={{ width: '60px', height: '1px', backgroundColor: 'rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {i}:00
                        </div>
                    ))}
                </div>
            </div>

            <img class="blob1" src={blob1}/>
            <img class="blob2" src={blob2}/>
            <img class="blob3" src={blob3}/>
            <img class="blob4" src={blob4}/>
            <img class="blob5" src={blob5}/>
        </div>
    );

    /*
        <div className="calendar">
                {calenderData.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                    {row.map((colorStrength, colIndex) => (
                        <div
                        key={colIndex}
                        className="day"
                        style={{ backgroundColor: `rgba(0, 0, 255, ${colorStrength / 10})` }}
                        >
                        {colorStrength}
                        </div>
                    ))}
                    </div>
                ))}
            </div>
    */
}

export default Sync
