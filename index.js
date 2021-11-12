const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.o9fdd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("perfumeDb");
        const productCollection = database.collection("products")
        const orderCollection = database.collection("order_perfume")
        const userCollection = database.collection('users')
        const reviewCollection = database.collection('reviews')

        // home component products call.............
        app.get('/services', async (req, res) => {
            const cursor = productCollection.find({})
            const result = await cursor.limit(6).toArray();
            res.send(result)
        })

        // product component products call all data...........
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({})
            const result = await cursor.toArray();
            res.send(result)
        })

        // insert product.........
        app.post('/product', async (req, res) => {
            const cursor = req.body;
            const result = await productCollection.insertOne(cursor)
            res.json(result)
        })

        //find by id ................
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await productCollection.findOne(filter)
            res.send(result)
        })

        // insert order...........
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.json(result)
        })

        // get user order list.........
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = orderCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)

        })

        // manage all orders.....................
        app.get('/allorders', async (req, res) => {
            const cursor = orderCollection.find({})
            const result = await cursor.toArray();
            res.send(result)
        })

        // make user..............
        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.json(result)
        })


        // delete to order list..............
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(filter)
            res.json(result)
        })
        // change order status
        app.put('/order/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const updateDoc = { $set: { status: 'Shipped' } };
            const result = await orderCollection.updateOne(filter, updateDoc)
            res.json(result)
        })

        // add admin..........................
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } };
            const result = await userCollection.updateOne(filter, updateDoc)
            res.json(result)
        })

        // verification admin........................
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const user = await userCollection.findOne(query)
            let isAdmin = false
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })
        // user review....................
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review)
            res.json(result)
        })

        // user reviews 
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    console.log("server hitting");
    res.send("server connected")
})
app.listen(port, () => {
    console.log("listening to ", port);
})
