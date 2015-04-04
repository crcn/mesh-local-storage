var crudlet              = require("crudlet");
var localStorageDatabase = require("..");
var sinon                = require("sinon");
var expect               = require("expect.js");

describe(__filename + "#", function() {

  it("can customize the storage key", function() {
    var db   = localStorageDatabase({ collection: "words", storageKey: "abba" });
    var setStub = sinon.stub(db.target.store, "set");
    db.target._save();
    expect(setStub.firstCall.args[0]).to.be("abba");
    setStub.restore();
  });

  it("can add local-storage specific options", function(next) {
    var db   = localStorageDatabase({ collection: "words", storageKey: "abba" });
    var setStub = sinon.spy(db.target, "insert");
    crudlet.clean(db)("insert", { localStorage: { a: 1}}).on("data", function() { }).on("end", function() {
      expect(setStub.callCount).to.be(1);
      expect(setStub.firstCall.args[1].a).to.be(1);
      next();
    });
  });

  it("saves when inserting", function(next) {
    var db   = localStorageDatabase({collection:"people"});
    var setStub = sinon.spy(db.target.store, "set");
    crudlet.clean(db)("insert", { data: { name: "abba" }}).on("data", function() { }).on("end", function() {
      expect(setStub.callCount).to.be(1);
      setStub.restore();
      next();
    });
  });

  it("saves when updating", function(next) {
    var db   = localStorageDatabase({collection:"people"});
    var stream = crudlet.open(db);

    var setStub = sinon.stub(db.target.store, "set");
    stream.on("data", function() { });
    stream.on("end", function() {

      stream = crudlet.open(db);
      stream.on("data", function() {
        expect(setStub.callCount).to.be(2);
        setStub.restore();
        next();
      });

      stream.end(crudlet.operation("update", { query: { name: "abba" }, data: { name: "baab" }}));
    });

    stream.end(crudlet.operation("insert", { data: { name: "abba" }}));
  });

  it("saves when removing", function(next) {
    var db   = localStorageDatabase({collection:"people"});
    var stream = crudlet.open(db);

    var setStub = sinon.stub(db.target.store, "set");
    stream.on("data", function() { });
    stream.on("end", function() {

      stream = crudlet.open(db);
      stream.on("data", function() {
        expect(setStub.callCount).to.be(2);
        setStub.restore();
        next();
      });

      stream.end(crudlet.operation("remove", { query: { name: "abba" }}));
    });

    stream.end(crudlet.operation("insert", { data: { name: "abba" }}));
  });

  it("can specify a custom storage object", function(next) {
    var i = 0;
    var j = 0;
    var db   = localStorageDatabase({ collection: "words", store: {
      get: function() {
        i++;
      },
      set: function() {
        j++;
      }
    } });
    expect(i).to.be(1);

    crudlet.clean(db)("insert", {}).on("data", function() {
      expect(j).to.be(1);
      next();
    });
  });
});
