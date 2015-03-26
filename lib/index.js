var store = process.browser ? require("store") {
  get: function() { },
  set: function() { }
}

function LocalStorageDatabase(idProperty) {
  this.idProperty = idProperty || "id";
  this.db = store.get("crudlet-db");
}

LocalStorageDatabase.prototype.run = function(operation, options, onRun) {
  var method = this[operation];
  if (!method) return onRun();
  method.call(options, onRun);
};

LocalStorageDatabase.prototype.insert = function(options, onRun) {
  var method = this[operation];
  if (!method) return onRun();
  method.call(options, onRun);
};

LocalStorageDatabase.prototype.update = function(options, onRun) {
  var method = this[operation];
  if (!method) return onRun();
  method.call(options, onRun);
};

LocalStorageDatabase.prototype.remove = function(options, onRun) {
  var method = this[operation];
  if (!method) return onRun();
  method.call(options, onRun);
};

LocalStorageDatabase.prototype.load = function(options, onRun) {
  var method = this[operation];
  if (!method) return onRun();
  method.call(options, onRun);
};

module.exports = LocalStorageDatabase;