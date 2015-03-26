var extend = require("deep-extend");
var sift   = require("sift");
var store  = process.browser ? require("store") : {
  get: function() { },
  set: function() { }
};

/**
 */

function _json(data) {
  return JSON.parse(JSON.stringify(data));
}

/**
 */

function LocalStorageDatabase(options) {
  if (!options) options = {};

  this.options    = options;
  this.idProperty = options.idProperty || "id";
  this.storageKey = options.storageKey || "crudlet-db";
  this.store      = options.store      || store;

  this.db         = this.store.get(this.storageKey) || {};
}

/**
 */

LocalStorageDatabase.prototype.run = function(operation, options, onRun) {
  var method = this[operation];
  if (!method) return onRun();
  options = extend({}, this.options, options, options.localStorage || {});
  if (!options.collection) return onRun(new Error("collection must exist"));
  method.call(this, this._collection(options), options, onRun);
};

/**
 */

LocalStorageDatabase.prototype.insert = function(collection, options, onRun) {

  var newData = _json(options.data || {});

  if (Object.prototype.toString.call(newData) === "[object Array]") {
    collection.push.apply(collection, newData);
  } else {
    collection.push(newData);
  }

  this._save();
  onRun(void 0, newData);
};

/**
 */

LocalStorageDatabase.prototype.update = function(collection, options, onRun) {
  var items = sift(options.query, collection);
  var ret = items;

  if (options.multi) {
    for (var i = items.length; i--;) extend(items[i], options.data);
  } else {
    var item = items.shift();
    ret = items;
    if (item) extend(item, options.data);
  }

  this._save();
  onRun(void 0, ret);
};

/**
 */

LocalStorageDatabase.prototype.remove = function(collection, options, onRun) {

  var items = sift(options.query, collection);
  var ret = items;

  if (options.multi) {
    for (var i = items.length; i--;) collection.splice(collection.indexOf(items[i]), 1);
  } else {
    var item = items.shift();
    ret = items;
    if (item) collection.splice(collection.indexOf(item), 1);
  }

  this._save();
  onRun(void 0, ret);
};

/**
 */

LocalStorageDatabase.prototype.load = function(collection, options, onRun) {
  var items = sift(options.query, collection);
  onRun(void 0, options.multi ? items : items.shift());
};

/**
 */

LocalStorageDatabase.prototype._collection = function(options) {
  return this.db[options.collection] || (this.db[options.collection] = []);
};

/**
 */

LocalStorageDatabase.prototype._save = function() {
  this.store.set(this.storageKey, this.db);
};

/**
 */

module.exports = function(options) {
  return new LocalStorageDatabase(options);
};
