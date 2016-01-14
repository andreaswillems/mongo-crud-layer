/**
 * Implements CRUD operations on regular MongoDB
 * collections, i.e. without GridFS functionality.
 *
 * @author Andreas Willems
 * @version 14 JAN 2016
 */
var logger = require('../helpers/logger');

module.exports.create = function(obj, collection, callback) {
    collection.insertOne(obj, function(err, doc) {
        // on error propagate the error
        if (err) {
            logger(err);
            return callback(err, null);
        }
        // otherwise return the stored document's id
        callback(null, doc.ops[0]._id);
    });
};

module.exports.read = function(criteria, collection, callback) {
    collection.find(criteria).toArray(function(err, docs) {
        if (err) {
            logger(err);
            return callback(err, null);
        }
        callback(null, docs);
    });
};

module.exports.readAll = function(collection, callback) {
    collection.find().toArray(function(err, docs) {
        if (err) {
            logger(err);
            return callback(err, null);
        }
        callback(null, docs);
    });
};

module.exports.update = function(criteria, obj, collection, callback) {
    collection.findOneAndReplace(criteria, obj, function(err, result) {
        if (err) {
            logger('MongoCrud.update(): ' + err);
            return callback(err, null);
        }
        logger('MongoCrud.update(): ' + result);
        callback(null, result);
    });
};

module.exports.delete = function(criteria, collection, callback) {
    collection.findOneAndDelete(criteria, function(err, result) {
        if (err) {
            logger('MongoCrud.delete(): ' + err);
            callback(err, null);
        }
        logger('MongoCrud.delete(): ' + result);
        callback(null, result);
    });
};