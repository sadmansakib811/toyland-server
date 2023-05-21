const express = require('express')
const app = express()
const cors = require ('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
// MIDDLEWARE
app.use(cors());
app.use(express.json());
// ===============================================
                    //  MONGO DB
// ===============================================
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kxlelta.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // create new db for this project and new collection for data:
    const toyCollection = client.db("toyDB").collection("toys");

    // =======================get all toys data=======================
    app.get('/toys', async(req, res)=>{
      const cursor = toyCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
     // ======================get product by category======================
     app.get('/toys/:category', async (req, res) => {
      const category = req.params.category;
      const query = { category:  category}; // Update the line here
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    });

   

   // ============================== Get My Toy using email ===============================
   app.get('/mytoys', async (req, res) => {
    console.log(req.query.selleremail);
    let query = {};
  
    // Only filter data if the selleremail parameter is provided
    if (req.query.selleremail) {
      query = { selleremail: req.query.selleremail };
    }
  
    const result = await toyCollection.find(query).toArray();
    res.send(result);
  });


// ===================== Delete Toy======================
 //  delete method:
  app.delete('/dlttoys/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId (id)};
    const result = await toyCollection.deleteOne(query);
    res.send(result);
  })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
// ===========================Mongo End Here===============
// express js simple code:
app.get('/', (req, res) => {
  res.send('toy is playing')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})