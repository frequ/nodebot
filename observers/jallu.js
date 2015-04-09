module.exports = function(bot, from, to, text, message, callback) {

  var lowerCasedText = text.toLowerCase();
  var jalluWords = [
    'jallu',
    'jaloviina',
    'jalmari'
];

  if (new RegExp(jalluWords.join("|")).test(lowerCasedText)) {

    var jalluTexts = [
      'Jallu on mielipidevaikuttajien juoma!',
      'Sen yhden tähden!',
      'https://www.youtube.com/watch?v=YYv4yadRexY',
      'Jallu on nautiskelujuoma.',
      'vai jallua tekee mieli? Hyvä.'
    ];

    callback(from+': '+jalluTexts[Math.floor(Math.random()*jalluTexts.length)]);

  }
};
