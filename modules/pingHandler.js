var moment = require('moment');

module.exports = function(bot, server, time){
    /*
        Quakenets ping interval seems to be 90 seconds
        Just to be sure we haven't got ping lets wait 120 seconds
        before trying to reconnect

    */

    function Interval(fn, time){
        var timer = false;

        this.start = function(){
            if (!this.isRunning){
                console.log('start');
                timer = setInterval(fn, time);
            }
        };

        this.stop = function(){
            clearInterval(timer);
            timer = false;
        };

        this.isRunning = function(){
            return timer !== false;
        };

    }

    var reconnect = function(){
        console.log(bot.conn);
        bot.connect(5, function(input){
            console.log('Reconnect succesfully', input);
        });
    };

    var now = moment().format("HH:mm:ss");
    var twoMins = 120*1000;
    var interval = new Interval(reconnect, twoMins);
    if (typeof global.pingsMade == 'undefined') {
        interval.start();
        global.pingsMade = 1;
    } else {
        interval.stop();
        interval.start();
        global.pingsMade++;
    }

    console.log('received ping', global.pingsMade, now);
};
