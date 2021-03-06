var fs = require('fs');

/*
 * Helper for reloading modules
 * -----------------------------------------------------------------------------
 * http://stackoverflow.com/a/15666221
 *
 * This function doesn't "reload" anything,
 * it just clears stuff from the require.cache so that other functions
 * will actually get the changed modules from the disk
 */

module.exports = function() {

  // delete stuff from require.cache
  fs.readdirSync('./actions/').forEach(function (file) {
    delete require.cache[require.resolve('../commands/'+file)];
  });

  fs.readdirSync('./observers/').forEach(function (file) {
    delete require.cache[require.resolve('../observers/'+file)];
  });

  // a message for the IRC bot to send to the admin user who called !reload
  return 'Commands, observeres, greetings & auto-op lists are now reloaded!';

};
