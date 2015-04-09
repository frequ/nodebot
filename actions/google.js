var cheerio = require('cheerio');
var needle = require('needle');

module.exports = function(bot, from, to, text, message, callback) {
    var q = text.split(/ (.+)/)[1];
    if (!q || q.length === 0) {
        callback('Try giving a keyword asshole. !google <keyword>');
        return;
    }

    var options = {
        follow_max: 5,
        headers: {
            'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1677.0 Safari/537.36"
        }
    };


    var url = 'http://google.com/custom?q=' + escape(q);

    needle.get(url, options, function(err, res, body){
        if(!err){

            $ = cheerio.load(body);
            var results = [];
            $('.g').each(function(i, el){
                el = $(el).find('.l');

                var item = {
                    link: el.attr('href'),
                    title: el.text()
                };

                if(results.length < 2){
                    results.push(item);
                }

            });

            /*jshint multistr: true */
            var returnString = 'The top two results for the querystring: "'+q+'": \n' +
                '1: ' + results[0].title + ' - ' + results[0].link +' \n' +
                '2: ' + results[1].title + ' - ' + results[1].link +' \n' +
                'More results at: '+ url;

            callback(returnString.trim());
        }
    });
};
