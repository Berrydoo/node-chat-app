const moment = require('moment');

var date = moment();
date.set({
    hour: 10,
    minute: 35
});
console.log(date.format('H:mm a'));

date.set({
    hour: 6,
    minute: 1
});
console.log(date.format('H:mm a'));

date = moment(4203498203498);
console.log(date.format('MMM d YYYY H:mm a'));
