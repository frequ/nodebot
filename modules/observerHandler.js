var fs = require('fs');

module.exports = function(bot, from, to, text, message) {

    //check if channel or pm
    var sendTo = from; // send pm
    if (to.indexOf('#') > -1) {
        sendTo = to; // send to channel
    }

    fs.readdirSync('./observers/').forEach(function (file) {
        var observeFunc = require('../observers/' + file);

        var callback = function(output){
            console.log('obs out', output);
            if (output) {
                bot.say(sendTo, output);
            }
        };

        observeFunc(bot, from, to, text, message, callback);
    });

};
