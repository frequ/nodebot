var moment = require('moment');

module.exports = function(bot, from, to, text, message, callback) {

    var res = text.split(" ");
    var minutes = res[1];
    var stuff = res.slice(2).toString().replace(/,/g," ");

    function isInt(n){
        return n % 1 === 0;
    }

    if (!minutes || minutes.length === 0) {
        callback('Try giving a time parameter asshole. !remind <minutes> <stuff>');
        return;
    }else if (!isInt(minutes)) {
        callback('Try giving a whole number you dumb fuck. !remind <minutes> <stuff>');
        return;
    }else if(minutes <= 0){
        callback('Try giving a positive integer dumbass. !remind <minutes> <stuff>');
        return;
    }else if (!stuff || stuff.length === 0){
        callback('Try giving a stuff string asshole. !remind <minutes> <stuff>');
        return;
    }

    var momentSort = function(a,b){
        if(a.time.isBefore(b.time)){
            return -1;
        }else if(a.time.isAfter(b.time)){
            return 1;
        }else{
            return 0;
        }
    };

    var checker = function(){
        var now = moment();
        if (global.reminders[0].time.isBefore(now, 'minutes') || global.reminders[0].time.isSame(now, 'minutes')) {
            triggerReminder(global.reminders[0]);
        }
    };

    var triggerReminder = function(reminder){
        global.reminders.shift();
        callback(reminder.from+': ACHTUNG! Do '+reminder.stuff+'!');

        if(global.reminders.length === 0){
            clearInterval(global.remindersInterval);
            global.remindersInterval = false;
        }
    };

    var reminder = {
        time: moment().add(minutes, 'minutes'),
        from: from,
        stuff: stuff
    };

    if (typeof global.reminders === "undefined"){
        global.reminders = [];
        global.reminders.push(reminder);
    }else{
        global.reminders.push(reminder);
        global.reminders.sort(momentSort);
    }

    if (!global.remindersInterval) {
        global.remindersInterval = setInterval(checker, 60000);
    }

    callback('Reminder for "'+stuff+'" set.');
};
