const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port =process.env.PORT || 5055

console.log(process.env.DB_USER)

app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ep4dk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




app.get('/', (req, res) => {
  res.send('Hello DataBase Working!')
})

client.connect(err => {
  console.log('connection err', err)
  console.log('Database Connected Successfully' )
    const collection = client.db("kiLagbe").collection("products");
    const orderCollection = client.db("kiLagbe").collection("order");

    // adding new products

    app.post('/addProduct', (req, res) =>{
      const newProduct = req.body;
      console.log('adding new event:', newProduct);
      collection.insertOne(newProduct)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
    })
    

    // add product
    app.post('/addProducts', (req, res) => {
    collection.insertMany(req.body)
    .then((result)=> {
        console.log(result);
    })
    })

    // from database

    app.get('/products', (req, res) => {
        collection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.post('/addOrder', (req, res) => {
      console.log(req.body);
      orderCollection.insertOne(req.body)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount > 0);
      })
    })


    app.get('/order', (req, res) => {
      console.log(req.query.email);
      orderCollection.find({'user.email': req.query.email})
      .toArray((err, documents) => {
          res.send(documents)
      })
  })


  app.delete('/deleteProduct/:id', (req, res) => {
    console.log(req.params.id)
    collection.findOneAndDelete({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.ok>0)
    })
  })




  });

  



app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})