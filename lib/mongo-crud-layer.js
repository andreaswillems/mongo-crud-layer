/**
 * Implements a simple CRUD layer for the node-mongodb-native driver.
 * This module provides methods for creating, reading, updating and
 * deleting objects / documents in a mongodb database.
 *
 * @author Andreas Willems
 * @version 14 JAN 2016
 */

var db = require('./db');
var logger = require('../helpers/logger');
var crudRegular = require('./crudRegular');
var crudGridStore = require('./crudGridStore');

/**
 * Creates a MongoCrudLayer instance with given properties.
 *
 * @param uri - the MongoDB URI, defaults to 'mongodb://localhost:27017/mongo-crud-test
 * @param options - Options used when connecting to MongoDB, defaults to an empty object
 * @param gridFS - set to true, if objects exceed MongoDB document limit of 16mb, to store
 * objects with GridFS mechanism
 * @constructor
 */
function MongoCrud(uri, options, gridFS) {
    this.uri = uri || 'mongodb://localhost:27017/mongo-crud-test';
    this.options = options || {};
    this.gridFS = gridFS;
}

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
    var self = this;
    db(this.uri, this.options, function(err, db) {
        if (err) {
            logger(err);
            return callback(err, null);
        }
        // decide between regular collections and gridFS
        if (!self.gridFS) {
            var coll = db.collection(collection);
            crudRegular.create(obj, coll, callback);
        } else {
            crudGridStore.create(db, obj, callback);
        }
    });
};

/**
 * Searches the given collection for documents matching the given criteria
 * and returns the found documents. The criterium should be in most cases
 * using the _id from the creation process, e.g. criteria = {_id: _id}.
 *
 * @param criteria - the criteria to search for in the database
 * @param collection - the collection to search in
 * @param callback - the callback function receiving the found documents
 * as array,
 * in case of an error, the error object
 */
MongoCrud.prototype.read = function(criteria, collection, callback) {
    if (arguments.length < 3) {
        return new Error('Wrong number of arguments; 3 arguments necessary');
    }
    var self = this;
    db(this.uri, this.options, function(err, db) {
        if (err) {
            logger(err);
            return callback(err, null);
        }
        // decide between regular collections and gridFS
        if (!self.gridFS) {
            var coll = db.collection(collection);
            crudRegular.read(criteria, coll, callback);
        } else {
            crudGridStore.read(db, criteria, callback);
        }
    });
};

/**
 * Returns all documents stored in the given collection as an array.
 * !!! Not available in GridFS mode !!!
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
        var coll = db.collection(collection);
        crudRegular.readAll(coll, callback);
    });
};

/**
 * Replaces the object in the given collection with given object.
 * !!! Not available in GridFS mode !!!
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
        var coll = db.collection(collection);
        crudRegular.update(criteria, obj, coll, callback);
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
    var self = this;
    db(this.uri, this.options, function(err, db) {
        if (err) {
            logger(err);
            return callback(err, null);
        }
        // decide between regular collections and gridFS
        if (!self.gridFS) {
            var coll = db.collection(collection);
            crudRegular.delete(criteria, coll, callback);
        } else {
            crudGridStore.delete(db, criteria, callback);
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