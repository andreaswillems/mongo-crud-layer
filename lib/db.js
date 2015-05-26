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
        } else {
            logger('Connected to database');
        }
        db_singleton = db;
        return callback(err, db_singleton);
    });
};