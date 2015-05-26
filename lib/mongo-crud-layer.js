/**
 * Implements a simple CRUD layer for the node-mongodb-native driver.
 * This module provides methods for creating, reading, updating and
 * deleting objects / documents in a mongodb database.
 *
 * @author Andreas Willems
 * @version 24 MAY 2015
 */

var mongo = require('mongodb');
var deprecate = require('depd')('mongo-crud-layer');
var MongoClient = mongo.MongoClient;
var db = require('./db');
var logger = require('../helpers/logger');

/**
 * Creates a MongoCrudLayer instance with given properties.
 *
 * @param uri - the MongoDB URI, defaults to 'mongodb://localhost:27017/mongo-crud-test
 * @param options - Options used when connecting to MongoDB, defaults to an empty object
 * @constructor
 */
function MongoCrud(uri, options) {
    this.uri = uri || 'mongodb://localhost:27017/mongo-crud-test';
    this.options = options || {};
}

/**
 * Connects to MongoDB using the uri this object was instantiated with.
 *
 * @param callback - the callback function that will receive the
 * db object representing the database connection or, in case of an error,
 * receives the error object
 *
 * @deprecated
 */
MongoCrud.prototype.connect = function(callback) {
    deprecate('Method will be removed in next major version');
    /*MongoClient.connect(this.uri, this.options, function(err, db) {
        if (err) {
            console.error(err);
            return callback(err);
        }
        callback(db);
    });*/
    db(this.uri, this.options, function(err, db) {
        if (err) {
            logger(err);
            return callback(err);
        }
        callback(db);
    });
};

/**
 * Creates a MongoDB document from the given object and stores it into the
 * given collection. Returns the _id of the stored document.
 *
 * @param obj - the object to store
 * @param collection - the collection to store the object in
 * @param callback - the callback function receiving the result object return
 * by the insertion operation.
 */
MongoCrud.prototype.create = function(obj, collection, callback) {
    /*MongoClient.connect(this.uri, this.options, function(err, db) {
        if (err) {
            console.error(err);
            return callback(err);
        }
        var coll = db.collection(collection);
        coll.insertOne(obj, function(err, doc) {
            // on error propagate the error
            if (err) {
                console.error(err);
                return callback(err);
            }
            // otherwise return the stored document's id
            callback(doc.ops[0]._id);
        });
    });*/
    if (arguments.length < 3) {
        return new Error('Wrong number of arguments; 3 arguments necessary');
    }
    db(this.uri, this.options, function(err, db) {
        if (err) {
            logger(err);
            return callback(err);
        }
        var coll = db.collection(collection);
        coll.insertOne(obj, function(err, doc) {
            // on error propagate the error
            if (err) {
                logger(err);
                return callback(err);
            }
            // otherwise return the stored document's id
            callback(doc.ops[0]._id);
        });
    });
};

/**
 * Searches the given collection for documents matching the given criteria
 * and returns the first one found. The criterium should be in most cases
 * using the _id from the creation process, e.g. criteria = {_id: _id}.
 *
 * @param criteria - the criteria to search for in the database
 * @param collection - the collection to search in
 * @param callback - the callback function receiving the found document or,
 * in case of an error, the error object
 */
MongoCrud.prototype.read = function(criteria, collection, callback) {
    MongoClient.connect(this.uri, this.options, function(err, db) {
        if (err) {
            logger(err);
            return callback(err);
        }
        var coll = db.collection(collection);
        coll.find(criteria).toArray(function(err, docs) {
            if (err) {
                logger(err);
                return callback(err);
            }
            callback(docs[0]);
        });
    });
};

/**
 * Returns all documents stored in the given collection as an array.
 * @param collection - the collection to search in
 * @param callback
 */
MongoCrud.prototype.readAll = function(collection, callback) {
    MongoClient.connect(this.uri, this.options, function(err, db) {
        if (err) {
            logger(err);
            return callback(err);
        }
        var coll = db.collection(collection);
        coll.find().toArray(function(err, docs) {
            if (err) {
                logger(err);
                return callback(err);
            }
            callback(docs);
        });
    });
};

/**
 * Replaces the object in the given collection with given object.
 *
 * @param criteria - the criterium to search for, usually the object's _id
 * @param obj - the replacement object
 * @param collection - the collection to search in
 * @param callback
 */
MongoCrud.prototype.update = function(criteria, obj, collection, callback) {
    MongoClient.connect(this.uri, this.options, function(err, db) {
        if (err) {
            logger(err);
            return callback(err);
        }
        var coll = db.collection(collection);
        coll.findOneAndReplace(criteria, obj, function(err, result) {
            if (err) {
                logger('MongoCrud.update(): ' + err);
                return callback(err);
            }
            logger('MongoCrud.update(): ' + result);
            callback(result);
        });
    });
};

/**
 * Deletes the document that matches the given criteria.
 *
 * @param criteria - the criteria to search for, usually the object's _id
 * @param collection - the collection to search in
 * @param callback - callback function receiving the result object returned by
 * the database
 */
MongoCrud.prototype.delete = function(criteria, collection, callback) {
    MongoClient.connect(this.uri, this.options, function(err, db) {
        if (err) {
            return callback(err);
        }
        var coll = db.collection(collection);
        coll.findOneAndDelete(criteria, function(err, result) {
            if (err) {
                logger('MongoCrud.delete(): ' + err);
                callback(err);
            }
            logger('MongoCrud.delete(): ' + result);
            callback(result);
        });
    });
};

/**
 * Closes the database connection.
 *
 * @param callback - a callback function
 */
MongoCrud.prototype.close = function(callback) {
    db(this.uri, this.options, function(err, db) {
        db.close(function(err) {
            if (err) {
                logger('MongoCrud.close(): ' + err);
                callback(err);
            }
            callback();
        });
    });
};

module.exports = MongoCrud;