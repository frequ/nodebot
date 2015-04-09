var stats = require('../modules/loggerHandler.js')

module.exports = function(app, bot){

    app.get('/api/stats', function(req, res){
        if (global.stats) {
            res.send(JSON.stringify(global.stats));
        }else{
            res.send({});
        }
    });


};
