/**
 * Implements CRUD operations on MongoDB GridStore.
 * This way documents bigger than 16 MB can be handled.
 *
 * @author Andreas Willems
 * @version 14 JUN 2015
 */
var GridStore = require('mongodb').GridStore;
var logger = require('../helpers/logger');


module.exports.create = function(db, obj, callback) {
    var fileName = obj.fileName || 'mongo-crud-testfile';
    // create a new file
    var gridStore = new GridStore(db, fileName, 'w');
    // open the new file
    gridStore.open(function(err, gs) {
        if (err) {
            logger('crudGridStore.create : ' + err);
            return callback(err, null);
        }
        // serialize obj
        var objToWrite = JSON.stringify(obj);
        // create node.js buffer from serialized obj
        objToWrite = new Buffer(objToWrite);

        // write to GridStore
        gs.write(objToWrite, function(err, gs2) {
            if (err) {
                logger('crudGridStore.create : ' + err);
                return callback(err, null);
            }
            // flush changes
            gs2.close(function(err, result) {
                if (err) {
                    logger('crudGridStore.create : ' + err);
                    return callback(err, null);
                }
                //console.log(result);
                callback(null, result._id);
            });
        });
    });
};

module.exports.read = function(db, criteria, callback) {
    if (!criteria._id) {
        return callback(
            new Error('crudGridStore.read : no ObjectID to look for'),
            null);
    }
    var gridStore = new GridStore(db, criteria._id, 'r');
    gridStore.open(function(err, gs) {
        if (err) {
            logger('crudGridStore.read : ' + err);
            return callback(err, null);
        }
        gs.read(function(err, data) {
            if (err) {
                logger('crudGridStore.read : ' + err);
                return callback(err, null);
            }
            var resObj = JSON.parse(data);
            resObj._id = gs.fileId;
            callback(null, resObj);
        });
    });

};

module.exports.delete = function(db, criteria, callback) {
    if (!criteria._id) {
        return callback(
            new Error('crudGridStore.delete : no ObjectID to look for'),
            null);
    }
    var gridStore = new GridStore(db, criteria._id, 'w');
    gridStore.open(function(err, gs) {
        gs.unlink(function(err, gs2) {
            if (err) {
                logger('crudGridStore.delete : ' + err);
                return callback(err, null);
            }
            gs2.close(function(err, result) {
                if (err) {
                    logger('crudGridStore.delete : ' + err);
                    return callback(err, null);
                }
                result.ok = 1;
                callback(null, result);
            })

        });
    });
};