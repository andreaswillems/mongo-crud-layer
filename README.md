# Mongo-CRUD-Layer 
[![Build Status](https://travis-ci.org/andreaswillems/mongo-crud-layer.svg?branch=master)](https://travis-ci.org/andreaswillems/mongo-crud-layer) 
[![npm version](https://badge.fury.io/js/mongo-crud-layer.svg)](http://badge.fury.io/js/mongo-crud-layer) 
[![Coverage Status](https://coveralls.io/repos/andreaswillems/mongo-crud-layer/badge.svg?branch=master)](https://coveralls.io/r/andreaswillems/mongo-crud-layer?branch=master)

A simple CRUD-interface for the node-mongodb-native driver.
Abstracts the creation, reading, updating and deleting of documents
into more comfortable methods.

Latest added feature: 
* support for GridFS / GridStore

## Installation

```shell
npm install mongo-crud-layer
```

or add it to your `package.json`.

## Usage

### 1. Instantiation

First, create a new MongoCrud instance to store the databases URI and (optional) some options.

```javascript
var mongocrud = new MongoCrud(uri, options, false);
```

* uri - the URI to MongoDB, e.g. mongodb://localhost:27017/mongocrud-test
* options - optional settings
* gridFS - set to true, if objects exceed MongoDB document limit of 16mb, to store objects with GridFS mechanism

```javascript
var MongoCrud = require('mongo-crud-layer');
var mongocrud = new MongoCrud(); 
// or 
var mongocrud = new MongoCrud('mongodb://localhost:27017/mongocrudtest');
// or
var mongocrud = new MongoCrud('mongodb://localhost:27017/mongocrudtest', {}, true);
...
```

### 2. API

The API offers the following methods:

#### create(obj, collection, callback)
Creates a MongoDB document from the given object and stores it into the given collection. Returns the _id of the stored document.
* obj - the object to store
* collection - the collection to store the object in
* callback - a callback function with two parameters: error and the ObjectID of the stored object

```javascript
var DB_URI = 'mongodb://localhost:27017/mongocrud-test';
var COLLECTION = 'objectStore';
var OBJ = {
    name: 'Athyrion'
};
var ID;
...
mongocrud.create(OBJ, COLLECTION, function(err, id) {
    console.log(id);
    ID = id;
});
...
```


#### read(criteria, collection, callback)
Searches the given collection for documents matching the given criteria and returns the found documents. The criterium should be in most cases using the _id from the creation process, e.g. criteria = {_id: _id}.

* criteria - the criteria to search for in the database, usually the object's _id
* collection - the collection to search in
* callback - a callback function with two parameters: error and the found documents

```javascript
...
mongocrud.read({ _id: ID }, COLLECTION, function(err, doc) {
    console.log(doc); // { _id: 55617c9226d7023b19edcdd1, name: "Athyrion" }
});
...
```


#### readAll(collection, callback)
Returns all documents stored in the given collection as an array.
**!!! Not available in GridFS mode !!!**

* collection - the collection to search in
* callback - a callback function with two parameters: error and an array of objects from the collection

```javascript
...
mongocrud.readAll(COLLECTION, function(err, docs) {
    console.log(docs); // [ { _id: 55617c9226d7023b19edcdd1, name: "Athyrion" }, ...]
});
...
```



#### update(criteria, obj, collection, callback)
Replaces the object in the given collection with given object.
**!!! Not available in GridFS mode !!!**

* criteria - the criteria to search for in the database, usually the object's _id
* obj - the replacing object
* collection - the collection to search in
* callback - a callback function with two parameters: error and a mongodb [result object](http://docs.mongodb.org/manual/reference/command/insert/#insert-command-output)

```javascript
...

OBJ.name = 'Athyrion-Westeros';

mongocrud.update({ _id: ID }, OBJ, COLLECTION, function(err, res) {
    console.log(res); // { ok: 1, n: 1 }
});
...
```

#### delete(critera, collection, callback)
Deletes the document that matches the given criteria.

* criteria - the criteria to search for in the database, usually the object's _id
* collection - the collection to search in
* callback - a callback function with two parameters: error and a mongodb [result object](http://docs.mongodb.org/manual/reference/command/insert/#insert-command-output

```javascript
...
mongocrud.delete({ _id: ID }, COLLECTION, function(err, res) {
    console.log(res); // { ok: 1, n: 1 }
});
...
```

#### close(callback)
Closes the connection to the database.

* callback - the callback function receiving null, if the closing was successful, otherwise a MongoError

```javascript
...
mongocrud.close(function(result) {
    // handle error
});
