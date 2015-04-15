var moment = require('moment');
var needle = require('needle');

module.exports = function(bot, from, to, text, message){

    if(typeof global.stats === "undefined"){
        global.stats = {};
    }

    var channel, i;
    if (to.indexOf('#') > -1) {
        channel = to; // send to channel
    }

    var now = moment();
    if( !global.stats[channel] ){
        global.stats[channel] = {'urls': [], 'times': [], 'started': now};

        for(i = 0; i < 24; i++){
            //TODO is this bit hard to read :)
            global.stats[channel].times[i] = 0;
        }
    }


    if( !global.stats[channel][from] ) {
        global.stats[channel][from] = {
            nick: from,
            words: 0,
            lines: 0
        };
    }

    function urlLookup( name, arr ) {
        for(i = 0, len = arr.length; i < len; i++) {
            if( arr[i].url === name )
            return arr[i];
        }
        return false;
    }

    //user activity

    var user = global.stats[channel][from];
    var words = text.split(' ');
    var wordCount = words.length;

    user.words += wordCount;
    user.lines++;

    user.wordsPerLine = parseFloat(user.words / user.lines).toFixed(1);
    user.lastMessage = now;

    //most active times
    var thisHour = now.format('H');
    global.stats[channel].times[thisHour]++;

    //	check if message contains urls, if yes, save urls to file
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    for (i = 0; i < wordCount; i++){

        if ( urlRegex.test(words[i]) ) {

            var options = {
                follow_max: 2,
                headers: {
                    'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1677.0 Safari/537.36"
                }
            };

            var url = words[i];

            needle.get(url, options, function(err, res, body) {

                if (!err && res.statusCode == 200) {

                    //check if url already exists
                    var urlsArray = global.stats[channel].urls;
                    var existsInArray = urlLookup(url, urlsArray);

                    if( !existsInArray ){
                        urlsArray.push({
                            'url': url,
                            'weight': 1,
                            'from': from,
                            'date': now
                        });

                    }else{
                        bot.say(to, "WANHA! " + existsInArray.from +" sano tän jo "+ existsInArray.date.format('D.M.YYYY HH:mm'));
                        //increase weight
                        existsInArray.weight++;
                        return;
                    }
                }else{
                    bot.say(to, "Is that even url?");
                }
            });
        }
    }
};
