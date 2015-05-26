var assert = require('assert');
var MongoCrud = require('../index.js');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var Db = require('mongodb').Db;

var DB_URI = 'mongodb://localhost:27017/mongocrud-test';
var COLLECTION = 'objectStore';
var OBJ = {
    name: 'Athyrion'
};

var mongoCrud = null;
var ID = null;


describe('Testing MongoCrudLayer', function() {

    // before everything else connect to database and drop test collection
    before(function(done) {
        MongoClient.connect(DB_URI, function(err, db) {
            var coll = db.collection(COLLECTION);
            coll.drop(function() {
                mongoCrud = new MongoCrud(DB_URI);
                done();
            });
        });
    });

    // close db connection after testing
    after(function(done) {
        mongoCrud.close(done);
    });

    describe('#connect()', function() {
        it('should return the db object', function(done) {
            mongoCrud.connect(function(db) {
                assert.notEqual(null, db);
                assert(db instanceof Db);
                done();
            });
        });
    });

    describe('#create()', function() {
        it('should return the id of the inserted document', function(done) {
            mongoCrud.create(OBJ, COLLECTION, function(id) {
                ID = id;
                assert(id instanceof ObjectID);
                assert.equal(id.toString().length, 24);
                done();
            });
        });
    });

    describe('#read()', function() {
        it('should return a document', function(done) {
            mongoCrud.read({_id: ID}, COLLECTION, function(doc) {
                assert.equal(doc._id.toString(), ID);
                assert.equal(doc.name, OBJ.name);
                done();
            });
        });
    });

    describe('#readAll()', function() {
        it('should return an array of documents', function(done) {
            mongoCrud.readAll(COLLECTION, function(results) {
                assert.equal(results.length, 1);
                assert.equal(results[0].name, OBJ.name);
                done();
            });
        });
    });

    describe('#update()', function() {
        it('should update the stored document and return a result object',
            function(done) {
                OBJ.name = 'Athyrion Westeros';
                // replace the stored object with the changed one
                mongoCrud.update({_id: ID}, OBJ, COLLECTION, function(res) {
                    assert.equal(res.ok, 1);

                    // assure that the update was successful
                    mongoCrud.read({_id: ID}, COLLECTION, function(doc) {
                        assert.equal(doc._id.toString(), ID);
                        assert.equal(doc.name, 'Athyrion Westeros');

                        // assure that the number of documents is the same
                        mongoCrud.readAll(COLLECTION, function(results) {
                            assert.equal(results.length, 1);
                        });

                        done();
                    });
                });
            }
        );
    });

    describe('#delete()', function() {
        it('should delete the stored document and return a result object',
            function(done) {
                OBJ.name = 'Athyrion Westeros';
                mongoCrud.delete({_id: ID}, COLLECTION, function(res) {
                    assert.equal(res.ok, 1);

                    // assure that there no more docs stored
                    mongoCrud.readAll(COLLECTION, function(results) {
                        assert.equal(results.length, 0);
                        done();
                    });
                });
            }
        );
    });
});
