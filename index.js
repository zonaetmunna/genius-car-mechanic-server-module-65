const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
     res.send('hi car');
})



// database 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fuuny.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
     try {
          await client.connect();
          const database = client.db("car-mechanic");
          const servicesCollection = database.collection("services");

          // post api
          app.post('/services', async (req, res) => {
               const service = req.body;
               const result = await servicesCollection.insertOne(service);
               console.log(result);
               res.send(result);
          });

          // GET api
          app.get('/services', async (req, res) => {
               const cursor = servicesCollection.find({});
               const services = await cursor.toArray();
               console.log(services);
               res.send(services);

          })
          // GET single service
          app.get('/services/:id', async (req, res) => {
               const id = req.params.id;
               const query = { _id: ObjectId(id) };
               const service = await servicesCollection.findOne(query);
               console.log('geting service', service)
               res.json(service);
          })

          // DELETE api
          app.delete('/services/:id', async (req, res) => {
               const id = req.params.id;
               const query = { _id: ObjectId(id) };
               const result = await servicesCollection.deleteOne(query);
               res.json(result);
          })



     }
     finally {
          // await client.close();
     }

}
run().catch(console.dirs)

app.listen(port, () => {
     console.log('listing the port', port);
})