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

  it("saves when inserting", function() {
    var db   = crudlet(localStorageDatabase({collection:"people"}));
    var setStub = sinon.stub(db.target.store, "set");
    db.insert({ data: { name: "abba" }});
    expect(setStub.callCount).to.be(1);
    setStub.restore();
  });

  it("saves when updating", function() {
    var db   = crudlet(localStorageDatabase({collection:"people"}));
    db.insert({ data: { name: "abba" }});
    var setStub = sinon.stub(db.target.store, "set");
    db.insert({ query: { name: "abba" }, data: { name: "baab" }});
    expect(setStub.callCount).to.be(1);
    setStub.restore();
  });

  it("saves when removing", function() {
    var db   = crudlet(localStorageDatabase({collection:"people"}));
    db.insert({ data: { name: "abba" }});
    var setStub = sinon.stub(db.target.store, "set");
    expect(db.target.db.people.length).to.be(1);
    db.remove({ query: { name: "abba" }});
    expect(db.target.db.people.length).to.be(0);
    expect(setStub.callCount).to.be(1);
    setStub.restore();
  });

  it("can specify a custom storage object", function() {
    var i = 0;
    var j = 0;
    var db   = crudlet(localStorageDatabase({ collection: "words", store: {
      get: function() {
        i++;
      },
      set: function() {
        j++
      }
    } }));
    expect(i).to.be(1);
    db.insert({data:{a:1}});
    expect(j).to.be(1);
  });
});
