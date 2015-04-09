var validUrl = require('valid-url');
var needle = require('needle');
var cheerio = require('cheerio');

module.exports = function(bot, from, to, text, message, callback) {

    function urlify(text) {
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, function(url) {
            return url;
        });
    }

    if ( text.indexOf('http://') >= 0 | text.indexOf('https://') >= 0) {

        var options = {
            follow_max: 0,
            headers: {
                'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1677.0 Safari/537.36"
            }
        };

        var url = urlify(text);

        if (validUrl.isUri(url)) {
            needle.get(url, options, function(err, res, body) {

                if (!err && res.statusCode == 200) {
                    var $ = cheerio.load(body);
                    var title = $('title').text().trim();
                    callback(title);
                }

            });
        }
    }
};
