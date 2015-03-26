var extend = require("deep-extend");
var sift   = require("sift");
var MemoryDatabase = require("crudlet-memory");

var store  = process.browser ? require("store") : {
  get: function() { },
  set: function() { }
};

/**
 */

function LocalStorageDatabase(options) {

  if (!options) options = {};
  if (!options.name) options.name = "localStorage";
  this.constructor.parent.call(this, options);

  this.storageKey = this.options.storageKey || "crudlet-db";
  this.store      = this.options.store      || store;

  this.db         = this.store.get(this.storageKey) || {};

  var self = this;
  this.on("didRun", function(options) {
    // TODO - check options.action
    self._save();
  });
}

/**
 */

MemoryDatabase.extend(LocalStorageDatabase, {
  _save: function() {
    this.store.set(this.storageKey, this.db);
  }
});

/**
 */

module.exports = function(options) {
  return new LocalStorageDatabase(options);
};
