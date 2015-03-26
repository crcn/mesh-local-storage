var crudlet              = require("crudlet");
var localStorageDatabase = require("..");
var sinon                = require("sinon");
var expect               = require("expect.js");

describe(__filename + "#", function() {

  it("can be used", function() {
    crudlet(localStorageDatabase());
  });

  it("can proper defaults", function() {
    var db = localStorageDatabase();
    expect(db.idProperty).to.be("id");
    expect(db.storageKey).to.be("crudlet-db");
  });

  it("can customize the storage key", function() {
    var db   = crudlet(localStorageDatabase({ collection: "words", storageKey: "abba" }));
    var setStub = sinon.stub(db.target.store, "set");
    db.target._save();
    expect(setStub.firstCall.args[0]).to.be("abba");
    setStub.restore();
  });

  it("returns an error if collection is not specified", function(next) {
    var db   = crudlet(localStorageDatabase());
    var stub = sinon.stub(db.target.store, "set");
    db.insert({ data: { name: "abba" }}, function(err) {
      expect(err).not.to.be(void 0);
      next();
    })
    stub.restore();
  });

  it("can collection in constructor", function(next) {
    var db   = crudlet(localStorageDatabase({ collection: "words" }));
    var stub = sinon.stub(db.target.store, "set");
    db.insert({ data: { name: "abba" }}, function(err) {
      stub.restore();
      expect(err).to.be(void 0);
      expect(stub.callCount).to.be(1);
      expect(stub.firstCall.args[0]).to.be("crudlet-db");
      next();
    });
  });


  it("can insert an item", function() {
    var db   = crudlet(localStorageDatabase());
    var stub = sinon.stub(db.target.store, "set");
    db.insert({ data: { name: "abba" }})
    stub.restore();
  })
});

