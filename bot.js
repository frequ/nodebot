var irc = require("irc");
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var config = require("./config.json");


var actionHandler = require('./modules/actionHandler.js');
var observerHandler = require('./modules/observerHandler.js');
var pingHandler = require('./modules/pingHandler.js');
var loggerHandler = require('./modules/loggerHandler.js');

var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels
});

bot.addListener("registered", function(){
    console.log( config.botName + ' succefully registered on server '+ config.server);

    bot.addListener("ping", function(server){
        pingHandler(bot, server);
    });

});

bot.addListener("error", function(err){
    console.log("error", err);
	if (err.command === "err_chanoprivsneeded") {
		bot.say(err.args[1], 'I need @ to do that.');
	} else if (err.command === "err_nosuchchannel") {
		bot.say(err.args[1], 'No such channel.');
	}

});

bot.addListener("message", function(from, to, text, message){

	if (text && text.length > 2 && text[0] == '!') {
		actionHandler(bot, from, to, text, message);
	}else{
		observerHandler(bot, from, to, text, message);
	}

	loggerHandler(bot, from, to, text, message);

});

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.listen(process.env.PORT || 3000);
require('./app/routes')(app, bot);
