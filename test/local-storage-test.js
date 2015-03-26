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

  it("can add local-storage specific options", function() {
    var db   = crudlet(localStorageDatabase({ collection: "words", storageKey: "abba" }));
    var setStub = sinon.stub(db.target, "insert");
    db.run("insert", { localStorage: { a: 1}});
    expect(setStub.callCount).to.be(1);
    expect(setStub.firstCall.args[1].a).to.be(1);
  });

  it("returns an error if collection is not specified", function(next) {
    var db   = crudlet(localStorageDatabase());
    var stub = sinon.stub(db.target.store, "set");
    db.insert({ data: { name: "abba" }}, function(err) {
      expect(err).not.to.be(void 0);
      next();
    });
    stub.restore();
  });

  it("can specify collection in constructor", function(next) {
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
    var db   = crudlet(localStorageDatabase({collection:"people"}));
    var stub = sinon.stub(db.target.store, "set");
    db.insert({ data: { name: "abba" }});
    expect(db.target.db.people[0].name).to.be("abba");
    expect(stub.callCount).to.be(1);
    stub.restore();
  });

  it("can insert multiple items at once", function() {
    var db   = crudlet(localStorageDatabase({collection:"people"}));
    db.insert({ data: [{ name: "abba" }, {name:"baab"}]});
    expect(db.target.db.people[0].name).to.be("abba");
    expect(db.target.db.people[1].name).to.be("baab");
  });

  it("can update an item with a query", function() {
    var db   = crudlet(localStorageDatabase({collection:"people"}));
    db.insert({ data: { name: "abba" }});
    db.insert({ data: { name: "abba" }});
    db.update({ query: { name: "abba" }, data: { name: "baab" }});
    expect(db.target.db.people[0].name).to.be("baab");
    expect(db.target.db.people[1].name).to.be("abba");
  });

  it("can update multiple items with a query", function() {
    var db   = crudlet(localStorageDatabase({collection:"people"}));
    db.insert({ data: { name: "abba" }});
    db.insert({ data: { name: "abba" }});
    db.update({ multi: true, query: { name: "abba" }, data: { name: "baab" }});
    expect(db.target.db.people[0].name).to.be("baab");
    expect(db.target.db.people[1].name).to.be("baab");
  });

  it("can remove an item, and only one item", function() {
    var db   = crudlet(localStorageDatabase({collection:"people"}));
    db.insert({ data: { name: "abba" }});
    db.insert({ data: { name: "abba" }});
    expect(db.target.db.people.length).to.be(2);
    db.remove({ query: { name: "abba" }});
    expect(db.target.db.people.length).to.be(1);
  });

  it("can remove multiple items", function() {
    var db   = crudlet(localStorageDatabase({collection:"people"}));
    db.insert({ data: { name: "abba" }});
    db.insert({ data: { name: "abba" }});
    expect(db.target.db.people.length).to.be(2);
    db.remove({ multi: true, query: { name: "abba" }});
    expect(db.target.db.people.length).to.be(0);
  });

  it("can load one item", function(next) {
    var db   = crudlet(localStorageDatabase({collection:"people"}));
    db.insert({ data: { name: "abba" }});
    db.load({ query: { name: "abba" }}, function(err, item) {
      expect(item.name).to.be("abba");
      next();
    });
  });

  it("can load multiple items", function(next) {
    var db   = crudlet(localStorageDatabase({collection:"people"}));
    db.insert({ data: [{ name: "abba" }, {name:"abba"}]});
    db.load({ multi: true, query: { name: "abba" }}, function(err, items) {
      expect(items[0].name).to.be("abba");
      expect(items[1].name).to.be("abba");
      next();
    });
  });
});
