/**
 * Implements a simple CRUD layer for the node-mongodb-native driver.
 * This module provides methods for creating, reading, updating and
 * deleting objects / documents in a mongodb database.
 *
 * @author Andreas Willems
 * @version 26 MAY 2015
 */

var deprecate = require('depd')('mongo-crud-layer');
var db = require('./db');
var logger = require('../helpers/logger');
var crudRegular = require('./crudRegular');

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
    this.gridFS = false;
}

/**
 * Connects to MongoDB using the uri this object was instantiated with.
 *
 * @param callback - the callback function that will receive the
 * db object representing the database connection or, in case of an error,
 * receives the error object
 *
 * @deprecated since version 0.0.4
 */
MongoCrud.prototype.connect = function(callback) {
    deprecate('Method will be removed in next major version');
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
    if (arguments.length < 3) {
        return new Error('Wrong number of arguments; 3 arguments necessary');
    }
    db(this.uri, this.options, function(err, db) {
        if (err) {
            logger(err);
            return callback(err, null);
        }
        // decide between regular collections and gridFS
        if (!MongoCrud.gridFS) {
            var coll = db.collection(collection);
            crudRegular.create(obj, coll, callback);
        } else {
            // empty for now
        }
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
    if (arguments.length < 3) {
        return new Error('Wrong number of arguments; 3 arguments necessary');
    }
    db(this.uri, this.options, function(err, db) {
        if (err) {
            logger(err);
            return callback(err, null);
        }
        // decide between regular collections and gridFS
        if (!MongoCrud.gridFS) {
            var coll = db.collection(collection);
            crudRegular.read(criteria, coll, callback);
        } else {
            // empty for now
        }
    });
};

/**
 * Returns all documents stored in the given collection as an array.
 * @param collection - the collection to search in
 * @param callback
 */
MongoCrud.prototype.readAll = function(collection, callback) {
    if (arguments.length < 2) {
        return new Error('Wrong number of arguments; 2 arguments necessary');
    }
    db(this.uri, this.options, function(err, db) {
        if (err) {
            logger(err);
            return callback(err, null);
        }
        // decide between regular collections and gridFS
        if (!MongoCrud.gridFS) {
            var coll = db.collection(collection);
            crudRegular.readAll(coll, callback);
        } else {
            // empty for now
        }
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
    if (arguments.length < 4) {
        return new Error('Wrong number of arguments; 4 arguments necessary');
    }
    db(this.uri, this.options, function(err, db) {
        if (err) {
            logger(err);
            return callback(err, null);
        }
        // decide between regular collections and gridFS
        if (!MongoCrud.gridFS) {
            var coll = db.collection(collection);
            crudRegular.update(criteria, obj, coll, callback);
        } else {
            // empty for now
        }
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
    if (arguments.length < 3) {
        return new Error('Wrong number of arguments; 4 arguments necessary');
    }
    db(this.uri, this.options, function(err, db) {
        if (err) {
            logger(err);
            return callback(err, null);
        }
        // decide between regular collections and gridFS
        if (!MongoCrud.gridFS) {
            var coll = db.collection(collection);
            crudRegular.delete(criteria, coll, callback);
        } else {

        }
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
                return callback(err, null);
            }
            callback(null, null);
        });
    });
};

module.exports = MongoCrud;