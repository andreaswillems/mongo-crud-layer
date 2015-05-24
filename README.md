# Mongo-CRUD-Layer

A simple CRUD-interface for the node-mongodb-native driver.

## Why?

Abstracts the creation, reading, updating and deleting of documents
into more comfortable method.

## Installation

```shell
npm install mongo-crud-layer
```

or add it to your `package.json`.

## Usage

### 1. Instantiate the mongocrud object

First, create a new MongoCrud instance to store the databases URI and (optional) some optional options.


```javascript
var MongoCrud = require('mongo-crud-layer');
var mongocrud = new MongoCrud(); // or ... new MongoCrud('mongodb://localhost:27017/mongocrudtest');

```

#### Heading size 4

Following is a list of items:

* `item 1` i am a description
* `item 2` i am a description
* `item 3` i am a description
* `item 4` i am a description


