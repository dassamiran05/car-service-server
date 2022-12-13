const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


//middle wares
//Carserviceuser
//Whfpo7Ldh1CzadJv
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8isb1v4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const serviceCollection = client.db("carService").collection("services");
    const ordersCollection = client.db("carService").collection("orders");
    const productsCollection = client.db("carService").collection("products");

    app.get('/services', async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    //Orders api
    app.post('/orders', async (req, res) => {
      const orders = req.body;
      const result = await ordersCollection.insertOne(orders);
      res.send(result);
    })


    //Get all orders by specific mail
    app.get('/orders', async (req, res) => {
      let query ={};
      const email = req.query.email;
      if (email) {
        query = { email: email };
      }
      const cursor = ordersCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    })

    //delete order api
    app.delete('/orders/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const deleteItem = await ordersCollection.deleteOne(query);
      res.send(deleteItem);
    })


    // get all products
    app.get('/products', async(req, res) =>{
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    })
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Car service server is running');
})

app.listen(port, () => {
  console.log(`Car server running on port ${port}`);
})