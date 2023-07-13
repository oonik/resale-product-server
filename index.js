const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bwrtzwz.mongodb.net/?retryWrites=true&w=majority`;

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
    const fanCategoriesCollection = client.db('resaleProduct').collection('fanCategories');
    const allFanCollection = client.db('resaleProduct').collection('allFan');

    app.get('/fancategory', async(req, res)=>{
        const query = {};
        const result = await fanCategoriesCollection.find(query).toArray();
        res.send(result)
    });

    app.get('/ceiling/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {};
        const fans = await allFanCollection.find(query).toArray();
        const result = fans.filter(fan => fan.category_id === id);
        res.send(result)
        })

  } finally {
    
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('old fan server is running')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })