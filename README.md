# Mongo-CRUD-Layer

A simple CRUD-interface for the node-mongodb-native driver.

## Why?

Abstracts the creation, reading, updating and deleting of documents
into more comfortable methods.

## Installation

```shell
npm install mongo-crud-layer
```

or add it to your `package.json`.

## Usage

### 1. Instantiation

First, create a new MongoCrud instance to store the databases URI and (optional) some optional options.


```javascript
var MongoCrud = require('mongo-crud-layer');
var mongocrud = new MongoCrud(); 
// or var mongocrud = new MongoCrud('mongodb://localhost:27017/mongocrudtest');

```

### 2. API

The API offers the following methods:

#### create(obj, collection, callback)
Creates a MongoDB document from the given object and stores it into the given collection. Returns the _id of the stored document.
* obj - the object to store
* collection - the collection to store the object in
* callback - the callback function receiving the result object return by the insertion operation


#### read()
Searches the given collection for documents matching the given criteria and returns the first one found. The criterium should be in most cases using the _id from the creation process, e.g. criteria = {_id: _id}.

#### readAll()
Returns all documents stored in the given collection as an array.

#### update()
Replaces the object in the given collection with given object.

#### delete()
Deletes the document that matches the given criteria.