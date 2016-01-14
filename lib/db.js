/**
 * Connects to the MongoDB database and stores the
 * returned instance for future references.
 *
 * @author Andreas Willems
 * @version 14 JAN 2016
 */

var MongoClient = require('mongodb').MongoClient;
var logger = require('../helpers/logger');
var db_singleton = null;

module.exports = function getConnection(uri, options, callback) {
    if (db_singleton) {
        return callback(null, db_singleton);
    }
    MongoClient.connect(uri, options, function(err, db) {
        if (err) {
            logger('Error creating database connection: ' + err);
        }
        db_singleton = db;
        return callback(err, db_singleton);
    });
};
