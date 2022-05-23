const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q7roj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {

    try {
        await client.connect();
        const productCollenction = client.db("digitaz").collection("products");
        const reviewCollenction = client.db("digitaz").collection("reviews");

        app.get('/products', async (req, res) => {
            const products = await productCollenction.find({}).toArray();
            res.send(products)
        })

        app.get('/reviews', async (req, res) => {
            const products = await reviewCollenction.find({}).toArray();
            res.send(products)
        })
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