const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'UnAuthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    });
}

const emailSenderOptions = {
    auth: {
        api_key: process.env.EMAIL_SENDER_KEY
    }
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q7roj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {

    try {
        await client.connect();
        const productCollenction = client.db("digitaz").collection("products");
        const userCollenction = client.db("digitaz").collection("users");
        const reviewCollenction = client.db("digitaz").collection("reviews");

        app.get('/products', async (req, res) => {
            const products = await productCollenction.find({}).toArray();
            res.send(products)
        })

        app.get('/reviews', async (req, res) => {
            const products = await reviewCollenction.find({}).toArray();
            res.send(products)
        })

        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollenction.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' })
            res.send({ result, token });
        });

    }
    catch {
        // client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('Digitaz server is running in port', port);
})

app.get('/', (req, res) => {
    res.send('Hello! I am from Digitaz server.')
})