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


const uri = `mongodb+srv://t-52-mobile-zone:A9B4Ep8UaPhEhNoZ@cluster0.7s5ai.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        //set database and collections
        const database = client.db("mobileZone-database");
        const productCollection = database.collection("products");
        const saveProductCollection = database.collection("saveProduct");
        const orderCollection = database.collection("orders");
        const blogsCollection = database.collection("blog");
        const saveUsersCollection = database.collection("users");
        const cartProductCollection = database.collection("cartProduct");


        //==================Post API- add product=======================//

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
            const productDetail = await productCollection.findOne({ _id: (req.params.id) });
            res.send(productDetail);
        });

        //DELETE product from add to cart

        app.delete("/products/:id", async (req, res) => {
            const deleteOrder = await productCollection.deleteOne({ _id: (req.params.id) });
            console.log(deleteOrder);
            res.json(deleteOrder);
        });




        //========get cart product============//

        app.get('/cartProduct', async (req, res) => {
            const cursor = cartProductCollection.find({})
            const result = await cursor.toArray();
            res.json(result);
        })


        //save cart product
        app.post('/cartProduct', async (req, res) => {
            const cartProduct = req.body;
            const result = await cartProductCollection.insertOne(cartProduct);
            res.json(result);
        });

        //DELETE product from add to cart

        app.delete("/cartProduct/:id", async (req, res) => {
            const deleteOrder = await cartProductCollection.deleteOne({ _id: ObjectId(req.params.id) });
            console.log(deleteOrder);
            res.json(deleteOrder);
        });



        //==============POST Order==============// 

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


        //===============POST API -Add new blog================//
        app.post('/blog', async (req, res) => {
            const blogs = await blogsCollection.insertOne(req.body);
            console.log(blogs);
        });


        //GET api - blogs
        app.get('/blog', async (req, res) => {
            const result = await blogsCollection.find({}).toArray();
            res.json(result)
        });


        //=======================save users=====================//
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
        });

        //UPDATE API- update users role 

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await saveUsersCollection.updateOne(filter, updateDoc);
            res.json(result);

        });

        //GET API- users

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await saveUsersCollection.findOne(query);

            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            };
            console.log(isAdmin);
            res.json({ admin: isAdmin });
        });

        //GET api -user
        app.get('/users', async (req, res) => {
            const result = await saveUsersCollection.find({}).toArray();
            res.json(result)
        });

        //DELETE api -user
        app.delete("/users/:id", async (req, res) => {
            const deleteUser = await saveUsersCollection.deleteOne({ _id: ObjectId(req.params.id) });
            res.json(deleteUser);
        });



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