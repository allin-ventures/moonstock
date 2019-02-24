var MongoClient = require('mongodb').MongoClient;



// Database Name
const dbName = 'moonstock';
var url = "mongodb://root:example@localhost:27017/";
const assert = require('assert')

const createCollection = (collName, dbo) => {

    dbo.createCollection(collName, function(err, res) {
      if (err) throw err;
      console.log("Collection " + collName + " created!");

    });
}

const install = async (db) => {

    await createCollection("curatedStocks", db)

    await createCollection("stockPredictions", db)

    await createCollection("users", db)

    await createCollection("transactions", db)
}




// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect(async (err) => {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  const db = client.db(dbName);

  await install(db);

  client.close();
});
