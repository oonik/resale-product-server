const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const bookingCollection = client.db('resaleProduct').collection('booking');
    const usersCollection = client.db('resaleProduct').collection('users');

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
        });

    app.post('/fan', async(req, res)=>{
        const fan = req.body;
        const result = await allFanCollection.insertOne(fan);
        res.send(result)
    })    

    app.post('/booking', async(req, res)=>{
       const booking = req.body;
       const result = await bookingCollection.insertOne(booking);
       res.send(result);
    });
    
    app.get('/bookings', async(req, res)=>{
        const email = req.query.email;
        const query = {email: email};
        const result = await bookingCollection.find(query).toArray();
        res.send(result)
    });

    app.delete('/booking/:id', async(req, res) =>{
       const id = req.params.id;
       const filter = {_id: new ObjectId(id)}
       const result = await bookingCollection.deleteOne(filter);
       res.send(result)
    });

    app.get('/users/seller/:email', async(req, res)=>{
       const email = req.params.email;
       const query = {email: email};
       const user = await usersCollection.findOne(query);
       res.send({isSeller: user?.role === 'seller'})
    });

    app.get('/users/admin/:email', async(req, res)=>{
       const email = req.params.email;
       const query = {email: email};
       const user = await usersCollection.findOne(query);
       res.send({isAdmin: user?.role === 'admin'})
    });

    app.delete('/users/admin/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await usersCollection.deleteOne(query);
        res.send(result)
    })

    app.get('/users', async(req, res)=>{
        const query = {};
        const result = await usersCollection.find(query).toArray();
        res.send(result);
    })

    app.post('/users', async(req, res)=>{
       const user = req.body;
       const result = await usersCollection.insertOne(user);
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