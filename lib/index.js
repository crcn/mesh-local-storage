var extend = require("deep-extend");
var store  = process.browser ? require("store") : {
  get: function() { },
  set: function() { }
}

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
  var options = extend({}, this.options, options);
  if (!options.collection) return onRun(new Error("collection must exist"));
  method.call(this, this._collection(options), options, onRun);
};

/**
 */

LocalStorageDatabase.prototype.insert = function(collection, options, onRun) {
  var newData = _json(options.data || {});
  collection.push(newData);
  this._save();
  onRun(void 0, newData);
};

/**
 */

LocalStorageDatabase.prototype.update = function(collection, options, onRun) {
  var method = this[operation];
};

/**
 */

LocalStorageDatabase.prototype.remove = function(collection, options, onRun) {
};

/**
 */

LocalStorageDatabase.prototype.load = function(collection, options, onRun) {
  var method = this[operation];
  if (!method) return onRun();
  method.call(options, onRun);
};

/**
 */

LocalStorageDatabase.prototype.load = function(options, onRun) {
  var method = this[operation];
  if (!method) return onRun();
  method.call(options, onRun);
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

module.exports = function (options) {
  return new LocalStorageDatabase(options);
};