var moment = require('moment');

module.exports = function(bot, from, to, text, message, callback) {
    var now = moment().format("dddd, MMMM Do YYYY, HH:mm:ss");
    callback('Server time is '+ now);
};
