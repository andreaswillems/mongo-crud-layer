# Mongo-CRUD-Layer 
[![Build Status](https://travis-ci.org/Athyrion/mongo-crud-layer.svg?branch=master)](https://travis-ci.org/Athyrion/mongo-crud-layer) 
[![npm version](https://badge.fury.io/js/mongo-crud-layer.svg)](http://badge.fury.io/js/mongo-crud-layer) 
[![Coverage Status](https://coveralls.io/repos/Athyrion/mongo-crud-layer/badge.svg?branch=master)](https://coveralls.io/r/Athyrion/mongo-crud-layer?branch=master)

A simple CRUD-interface for the node-mongodb-native driver.
Abstracts the creation, reading, updating and deleting of documents
into more comfortable methods.

Upcoming features: 
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
var mongocrud = new MongoCrud(uri, options);
```

* uri - the URI to MongoDB, e.g. mongodb://localhost:27017/mongocrud-test
* options - optional settings

```javascript
var MongoCrud = require('mongo-crud-layer');
var mongocrud = new MongoCrud(); 
// or 
var mongocrud = new MongoCrud('mongodb://localhost:27017/mongocrudtest');
...
```

### 2. API

The API offers the following methods:

#### create(obj, collection, callback)
Creates a MongoDB document from the given object and stores it into the given collection. Returns the _id of the stored document.
* obj - the object to store
* collection - the collection to store the object in
* callback - the callback function receiving the result object return by the insertion operation

```javascript
var DB_URI = 'mongodb://localhost:27017/mongocrud-test';
var COLLECTION = 'objectStore';
var OBJ = {
    name: 'Athyrion'
};
var ID;
...
mongocrud.create(OBJ, COLLECTION, function(id) {
    console.log(id);
    ID = id;
});
...
```


#### read(criteria, collection, callback)
Searches the given collection for documents matching the given criteria and returns the first one found. The criterium should be in most cases using the _id from the creation process, e.g. criteria = {_id: _id}.

* criteria - the criteria to search for in the database, usually the object's _id
* collection - the collection to search in
* callback - the callback function receiving the found document or, in case of an error, the error object

```javascript
...
mongocrud.read({ _id: ID }, COLLECTION, function(doc) {
    console.log(doc); // { _id: 55617c9226d7023b19edcdd1, name: "Athyrion" }
});
...
```


#### readAll(collection, callback)
Returns all documents stored in the given collection as an array.

* collection - the collection to search in
* callback - the callback function receiving an array containing the results

```javascript
...
mongocrud.readAll(COLLECTION, function(docs) {
    console.log(docs); // [ { _id: 55617c9226d7023b19edcdd1, name: "Athyrion" }, ...]
});
...
```



#### update(criteria, obj, collection, callback)
Replaces the object in the given collection with given object.

* criteria - the criteria to search for in the database, usually the object's _id
* obj - the replacing object
* collection - the collection to search in
* callback - the callback function receiving the result object returned by MongoDB

```javascript
...

OBJ.name = 'Athyrion-Westeros';

mongocrud.update({ _id: ID }, OBJ, COLLECTION, function(res) {
    console.log(res); // { ok: 1, n: 1 }
});
...
```

#### delete(critera, collection, callback)
Deletes the document that matches the given criteria.

* criteria - the criteria to search for in the database, usually the object's _id
* collection - the collection to search in
* callback - the callback function receiving the result object returned by MongoDB

```javascript
...
mongocrud.delete({ _id: ID }, COLLECTION, function(res) {
    console.log(res); // { ok: 1, n: 1 }
});
...
```

#### close(callback)
Closes the connection to the database.

* callback - the callback function receiving null, if the closing was successful, otherwise an MongoError

```javascript
...
mongocrud.close(function(result) {
    // handle error
});
