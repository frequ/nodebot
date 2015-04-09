module.exports = function(bot, from, to, text, message, callback){

    var lowerCasedText = text.toLowerCase();
    var tissit = [
        'tissi',
        'tissit',
        'tits',
        'boobs',
        'moukarit',
        'titties',
        'rinnat',
        'tissejä',
        'tissien'
    ];

    if (new RegExp(tissit.join("|")).test(lowerCasedText)) {
        callback('Did someone mention tits?! Mmm-mm..');
    }

};
