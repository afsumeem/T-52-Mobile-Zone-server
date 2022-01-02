const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleaware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7s5ai.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        //set database and collections
        const database = client.db("mobileZone-database");
        const productCollection = database.collection("products");
        const saveProductCollection = database.collection("saveProduct");
        const saveUsersCollection = database.collection("users");



        //Post API- add product

        app.post('/products', async (req, res) => {
            const product = await productCollection.insertOne(req.body);
            res.json(product);
        });

        //get products API
        app.get("/products", async (req, res) => {
            const products = await productCollection.find({}).toArray();
            res.send(products);
        });

        //get api- product details
        app.get('/products/:id', async (req, res) => {
            const productDetail = await productCollection.findOne({ _id: ObjectId(req.params.id) });
            res.send(productDetail);
        });


        //add to cart
        app.post('/saveProduct', async (req, res) => {
            const saveCart = req.body;
            const result = await saveProductCollection.insertOne(saveCart);
            res.json(result);

        });

        app.get('/saveProduct', async (req, res) => {
            const cursor = saveProductCollection.find({})
            const result = await cursor.toArray();
            res.json(result);
        })

        //POST Order (add to cart)

        app.post('/orders', async (req, res) => {
            const order = await orderCollection.insertOne(req.body);
            res.json(order)
        });

        //GET ordered products

        app.get('/orders', async (req, res) => {
            const order = orderCollection.find({});
            const result = await order.toArray();
            res.json(result)
        });

        //DELETE ordered product

        app.delete("/orders/:id", async (req, res) => {
            const deleteOrder = await orderCollection.deleteOne({ _id: ObjectId(req.params.id) });
            res.json(deleteOrder);
        });

        //save users
        app.post('/users', async (req, res) => {
            const users = await saveUsersCollection.insertOne(req.body);
            console.log(users);
            res.json(users);
        });

        //update users api
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await saveUsersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })
















        console.log('database connected successfully');

    } finally {
        //await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send(' server is running');
});

app.listen(port, () => {
    console.log('server running at port', port);
});