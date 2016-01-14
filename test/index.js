var assert = require('assert');
var MongoCrud = require('../index.js');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
//var Db = require('mongodb').Db;

var DB_URI = 'mongodb://localhost:27017/mongocrud-test';
var COLLECTION = 'objectStore';
var OBJ = {
    name: 'Athyrion',
    fileName: 'testfile4.bin'
};

var GRIDFS = false;
var mongoCrud = null;
var mongoCrudFS = null;
var ID = null;


describe('Testing MongoCrudLayer - regular', function() {

    // before everything else connect to database and drop test collection
    before(function(done) {
        MongoClient.connect(DB_URI, function(err, db) {
            var coll = db.collection(COLLECTION);
            coll.drop(function() {
                mongoCrud = new MongoCrud(DB_URI, {}, false);
                mongoCrudFS = new MongoCrud(DB_URI, {}, true);
                done();
            });
        });
    });

    // close db connection after testing
    after(function(done) {
        mongoCrud.close(function() {
          mongoCrudFS.close(done);  
        });        
    });

    describe('#create()', function() {
        it('should throw an error when providing less than 3 arguments',
            function(done) {
                var fn = function() {
                    if (mongoCrud.create() instanceof  Error) {
                        throw new Error(
                            'Wrong number of arguments; 3 arguments necessary');
                    }
                };

                assert.throws(
                    // block
                    function() {
                        fn();
                    },
                    /Wrong number of arguments; 3 arguments necessary/
                );
                done();
            }
        );

        it('should return the id of the inserted document', function(done) {
            mongoCrud.create(OBJ, COLLECTION, function(err, id) {
                assert.equal(null, err);
                ID = id;
                assert(id instanceof ObjectID);
                assert.equal(id.toString().length, 24);
                done();
            });
        });

        //if (GRIDFS) {
            it('should store an object bigger than 16mb', function(done) {
                this.timeout(15000);
                var date = Date.now();
                var tmpOBJ = {
                    name: 'Athyrion',
                    fileName: 'testfile' + date + '.bin',
                    //payload: new Buffer(20971521)
                    payload: new Buffer(17825792) // 17 MB
                };
                //console.log(tmpOBJ);

                mongoCrudFS.create(tmpOBJ, COLLECTION, function(err, id) {
                    assert.equal(null, err);
                    assert(id instanceof ObjectID);
                    assert.equal(id.toString().length, 24);
                    done();
                });
            });
        //}
    });

    describe('#read()', function() {
        it('should throw an error when providing less than 3 arguments',
            function(done) {
                var fn = function() {
                    if (mongoCrud.read() instanceof Error) {
                        throw new Error(
                            'Wrong number of arguments; 3 arguments necessary');
                    }
                };

                assert.throws(
                    // block
                    function() {
                        fn();
                    },
                    /Wrong number of arguments; 3 arguments necessary/
                );
                done();
            }
        );

        it('should return a document', function(done) {
            mongoCrud.read({_id: ID}, COLLECTION, function(err, doc) {
                assert.equal(null, err);
                assert.equal(doc[0]._id.toString(), ID);
                assert.equal(doc[0].name, OBJ.name);
                done();
            });
        });
    });

    describe('#readAll()', function() {
        it('should throw an error when providing less than 2 arguments',
            function(done) {
                var fn = function() {
                    if (mongoCrud.read() instanceof Error) {
                        throw new Error(
                            'Wrong number of arguments; 2 arguments necessary'
                        );
                    }
                };

                assert.throws(
                    // block
                    function() {
                        fn();
                    },
                    /Wrong number of arguments; 2 arguments necessary/
                );
                done();
            }
        );

        //if (!GRIDFS) {
            it('should return an array of documents', function(done) {
                mongoCrud.readAll(COLLECTION, function(err, results) {
                    assert.equal(null, err);
                    assert(results.length >= 1);
                    assert.equal(results[0].name, OBJ.name);
                    done();
                });
            });
        //}
    });

    describe('#update()', function() {
        it('should throw an error when providing less than 4 arguments',
            function(done) {
                var fn = function() {
                    if (mongoCrud.read() instanceof Error) {
                        throw new Error(
                            'Wrong number of arguments; 4 arguments necessary'
                        );
                    }
                };

                assert.throws(
                    // block
                    function() {
                        fn();
                    },
                    /Wrong number of arguments; 4 arguments necessary/
                );
                done();
            }
        );

        //if (!GRIDFS) {
            it('should update the stored document and return a result object',
                function(done) {
                    OBJ.name = 'Athyrion Westeros';
                    // replace the stored object with the changed one
                    mongoCrud.update({_id: ID}, OBJ, COLLECTION, function(err, res) {
                        assert.equal(null, err);
                        assert.equal(res.ok, 1);

                        // assure that the update was successful
                        mongoCrud.read({_id: ID}, COLLECTION, function(err, doc) {
                            assert.equal(null, err);
                            assert.equal(doc[0]._id.toString(), ID);
                            assert.equal(doc[0].name, 'Athyrion Westeros');

                            // assure that the number of documents is the same
                            mongoCrud.readAll(COLLECTION, function(err, results) {
                                assert.equal(null, err);
                                assert.equal(results.length, 1);
                            });

                            done();
                        });
                    });
                }
            );
        //}
    });

    describe('#delete()', function() {
        it('should throw an error when providing less than 3 arguments',
            function(done) {
                var fn = function() {
                    if (mongoCrud.read() instanceof Error) {
                        throw new Error(
                            'Wrong number of arguments; 3 arguments necessary'
                        );
                    }
                };

                assert.throws(
                    // block
                    function() {
                        fn();
                    },
                    /Wrong number of arguments; 3 arguments necessary/
                );
                done();
            }
        );

        it('should delete the stored document and return a result object',
            function(done) {
                OBJ.name = 'Athyrion Westeros';
                mongoCrud.delete({_id: ID}, COLLECTION, function(err, res) {
                    assert.equal(null, err);
                    assert.equal(res.ok, 1);

                    if (!GRIDFS) {
                        // assure that there no more docs stored
                        mongoCrud.readAll(COLLECTION, function(err, results) {
                            assert.equal(null, err);
                            assert.equal(results.length, 0);
                            done();
                        });
                    } else {
                        done();
                    }
                });
            }
        );
    });

    describe('#close()', function() {
        it('should close the database connection', function(done) {
            mongoCrud.close(function(err, res) {
                assert.equal(null, err);
                assert.equal(null, res);
                mongoCrudFS.close(function(err2, res2) {
                  assert.equal(null, err2);
                  assert.equal(null, res2);
                  done();
                });
            });
        });
    });
});
