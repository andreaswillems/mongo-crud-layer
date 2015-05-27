var fs = require('fs');
var DEBUG = true;

module.exports = function(msg) {
    if (DEBUG) {
        var logMsg = new Date().toLocaleString() + ' : ' + msg + '\n';

        fs.appendFile('debug.log', logMsg, function(err) {
            if (err) throw err;
        });
    }
};