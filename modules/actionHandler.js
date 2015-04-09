var fs = require('fs');
var isAdmin = require('./isAdmin.js');

module.exports = function(bot, from, to, text, message){

    //check if channel or pm
    var sendTo = from; // send pm
    if (to.indexOf('#') > -1) {
        sendTo = to; // send to channel
    }


    var ircCommands = {

        join: function(param){
            if (isAdmin(message.prefix)) {
                bot.join(param);
            }else{
                bot.say(sendTo, 'Only admins plz.');
            }
        },

        part: function(param){
            if (isAdmin(message.prefix)) {
                if (text.split(' ')[1] !== undefined && text.split(' ')[1].indexOf('#') > -1) {
                    bot.part(text.split(' ')[1]);
                } else {
                    bot.part(sendTo);
                }
            }else{
                bot.say(sendTo, 'Only admins plz.');
            }
        },

        quit: function(param){
            if (isAdmin(message.prefix)) {
                bot.disconnect("As you wish m'lord!", function(){
                    process.exit();
                });
            } else {
                bot.say(sendTo, 'Who do you think you are? lolz.');
            }
        },

        topic: function(param){
            bot.send('TOPIC', sendTo, param);
        },

        say: function(param){
            if (isAdmin(message.prefix) && param.length > 0){
                bot.say(sendTo, param);
            }else{
                bot.say(sendTo, 'Only admins plz.');
            }
        },

        stats: function(){
            bot.say(sendTo, 'Stats maybe: http://samppavalkama.com:3000/');
        },

        help: function(){

            var buildString = function(){
                var string = "Available commands: \n";
                var availableCmds = [];
                var i = true;

                //Lets show only non-admin cmds
                var nonAdminCmds = ['topic','stats','help'];

                Object.keys(ircCommands).forEach(function(key){
                    if(nonAdminCmds.indexOf(key) > -1){
                        availableCmds.push(key);
                    }
                });

                fs.readdirSync('./actions/').forEach(function(file){
                    availableCmds.push(file.replace(/\.js$/, ''));
                });

                availableCmds.forEach(function(cmd) {
                    if(i){
                        string += "!"+cmd;
                        i = false;
                    }else{
                        string += ", !"+cmd;
                    }
                });
                return string;
            };
            var helpString = buildString();
            bot.say(sendTo, helpString);
        }
    };

    var action = String(text.split(' ')[0]).replace('!', '');


    if (fs.existsSync('./actions/' + action + '.js')) { // check if we have an action file
        var actionFunc = require('../actions/' + action + '.js');

        var callback = function(output){
            console.log('act out', output);
            if (output){
                bot.say(sendTo, output);
            }
        };

        actionFunc(bot, from, to, text, message, callback);

    } else if (ircCommands.hasOwnProperty(action)) {

        var param = text.substring(String(text.split(' ')[0]).length).trim();

        var funcsWithParam = ['join','part','quit','say','topic'];
        if(!param && funcsWithParam.indexOf(action) > -1){
            bot.say(sendTo, 'GIMME A PARAM YO!');
        }else{
            ircCommands[action](param);
        }

    } else {
        bot.say(sendTo, 'Unknown action! Fuck you '+from+'!');
    }
};
