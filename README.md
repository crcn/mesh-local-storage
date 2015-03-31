[![Build Status](https://travis-ci.org/mojo-js/crudlet-local-storage.svg)](https://travis-ci.org/mojo-js/crudlet-local-storage) [![Coverage Status](https://coveralls.io/repos/mojo-js/crudlet-local-storage/badge.svg?branch=master)](https://coveralls.io/r/mojo-js/crudlet-local-storage?branch=master) [![Dependency Status](https://david-dm.org/mojo-js/crudlet-local-storage.svg)](https://david-dm.org/mojo-js/crudlet-local-storage)

This module is a local storage database adapter for [crudlet](https://github.com/mojo-js/crudlet.js) - a library that makes it easy to persist data through multiple transports.

#### Features

- offline-mode - enable users to browse your application without an API (assuming there's local data)
- faster initial load times - great for mobile devices
- can be used with other database transports such as [crudlet-http](https://github.com/mojo-js/crudlet-http)
- cascades operations to other transports


#### installation

```
npm install crudlet-local-storage
```

```javascript
var crudlet = require("crudlet");
var localdb = require("crudlet-local-storage");

var db = crudlet(localdb());
```

#### db localdb(options)

creates a local crudelt database

- `options` - options for the local db
  - `storageKey` - storage key to use
  - `store` - store to use

```javascript
var db = localdb({
  storageKey: "storage-key",
  store: {
    get: function(storageKey) {
      // return DB yere
    },
    set: function(storageKey, value) {
      // set db here
    }
  }
});
```

#### db.run(operation, options, onComplete)

runs an operation

- `operation` - operation to run can be: `insert`, `remove`, `update`, or `load`
- `options` - operation specific options

insert options:

- `data` - data to insert. Can be an object, or an array to insert multiple

```javascript
db.run("insert", { data: [{ name: "a"}, { name: "b" }]}); // insert two items
db.run("insert", { data: { name: "gg"}}); // insert one item
```

remove options:

- `query` - mongodb search query
- `multi` - TRUE if you want to remove multiple items (false by default)

update options:

- `query` - mongodb search query
- `multi` - TRUE if you want to update multiple items (false by default)
- `data` - data to set - this is merged with existing data

load options:

- `query` - mongodb search query
- `multi` - TRUE if you want to load multiple items (one by default)



