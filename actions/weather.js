var cheerio = require('cheerio');
var needle = require('needle');
var moment = require('moment');

module.exports = function(bot, from, to, text, message, callback) {

    var q = text.split(/ (.+)/)[1];
    if (!q || q.length === 0) {
        callback('Try giving a location asshole. !weather <location>');
        return;
    }

    var headers = {
        'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1677.0 Safari/537.36"
    };

    var month = moment().format('MMMM');
    var url = 'http://thefuckingweather.com/'+month+'/'+escape(q);

    var fahrenheitToCelsius = function(f){
        return Math.round((f-32)/1.8);
    };

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    needle.get(url, headers, function(err, res, body){
        if(!err && res.statusCode == 200){

            var $ = cheerio.load(body);
            var tempHi = $('tr.highRow td.temperature').first().text();
            var tempLo = $('tr.lowRow td.temperature').first().text();
            var flavor = $('h2.remark').text();

            var returnString = "";
            if(tempHi && tempLo && flavor){
                tempHi = fahrenheitToCelsius(tempHi) +"°C";
                tempLo = fahrenheitToCelsius(tempLo) +"°C";
                q = capitalizeFirstLetter(q);
                returnString = 'Todays temperature in '+q+', highest ' +tempHi+ ' and lowest: '+tempLo+ '\n'+flavor;
            }else{
                returnString = 'CAN\'T FIND THAT SHIT!';
            }

            callback(returnString.trim());
        }
    });

};
