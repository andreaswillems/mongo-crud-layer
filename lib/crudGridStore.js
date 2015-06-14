/**
 * Implements CRUD operations on MongoDB GridStore.
 * This way documents bigger than 16 MB can be handled.
 *
 * @author Andreas Willems
 * @version 14 JUN 2015
 */
var ObjectID = require('mongodb').ObjectID;
var GridStore = require('mongodb').GridStore;
var logger = require('../helpers/logger');


module.exports.create = function(obj, db, callback) {
    var fileName = obj.fileName || 'mongo-crud-testfile';
    // create a new file
    var gridStore = new GridStore(db, fileName, 'w');
    // open the new file
    gridStore.open(function(err, gridStore) {
        if (err) {
            logger('crudGridStore.create : ' + err);
            return callback(err, null);
        }
        gridStore.write(obj, function(err, gridStore) {
            if (err) {
                logger('crudGridStore.create : ' + err);
                return callback(err, null);
            }
            gridStore.close(function(err, result) {
                if (err) {
                    logger('crudGridStore.create : ' + err);
                    return callback(err, null);
                }
                console.log(result);
                callback(null, result._id);
            });
        });
    });
};

module.exports.read = function(criteria, db, callback) {
    if (!criteria._id) {
        return callback(
            new Error('crudGridStore.read() : no ObjectID to look for'),
            null);
    }

    // read from GridStore

};

module.exports.readAll = function() {};

module.exports.update = function() {};

module.exports.delete = function() {};