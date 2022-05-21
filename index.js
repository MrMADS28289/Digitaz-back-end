const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.log('Digitaz server is running in port', port);
})

app.get('/', (req, res) => {
    res.send('Hello! I am from Digitaz server.')
})