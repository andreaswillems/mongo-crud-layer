var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
var Db = require('mongodb').Db;
var MongoCrud = require('../index.js');

var DB_URI = 'mongodb://localhost:27017/mongocrud-test';
var COLLECTION = 'objectStore';
var OBJ = {
    name: 'Athyrion'
};

var mongocrud = new MongoCrud(DB_URI);


describe('Testing MongoCrudLayer', function() {
    describe('#connect()', function() {
        it('should connect to mongodb and return the db object', function() {
             assert.equal(true, false);
        });
    });
});

