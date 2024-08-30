// testFindFreeTime.js
const findFreeTime = require('../config/getFreeTimes');

(async () => {
    try {
        const calendarLink = 'https://calendar.google.com/calendar/embed?src=hfkcspg4u31mb4kph4h22dogoc%40group.calendar.google.com&ctz=America%2FLos_Angeles';
        const freeTimes = await findFreeTime(calendarLink);
        console.log('Free Times:', freeTimes);
    } catch (error) {
        console.error('Error finding free times:', error);
    }
})();