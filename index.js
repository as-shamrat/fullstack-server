const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());
require("dotenv").config();
console.log(process.env.DB_USER);

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.et2qp.mongodb.net/volunteerEvents?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const collection = client.db("volunteerEvents").collection("events");
  // perform actions on the collection object
  app.post("/addRegData", (req, res) => {
    const regData = req.body;
    collection.insertOne(regData).then((result) => {
      console.log(result.insertedCount);
    });
  });
  app.delete("/deleteItem", (req, res) => {
    const queryEventName = req.query.eventname;
    const queryEmail = req.query.email;
    console.log(queryEventName, queryEmail);
    collection
      .deleteOne({ eventName: queryEventName, email: queryEmail })
      .then((result) => {
        console.log(result);
        res.send(result);
      });
  });

  app.get("/allEvents", (req, res) => {
    const reqEmail = req.query.email;
    // console.log(reqEmail);
    collection.find({ email: reqEmail }).toArray((err, documents) => {
      res.send(documents);
    });
  });
  console.log("db connected successfully");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
