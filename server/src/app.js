const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const MongoClient = require('mongodb').MongoClient;



const app = express();
const dbName = 'pokedex';
const url = `mongodb://pokemon:dev@naruto:57017/${dbName}`;

const query = async (collectionName) => {
    const client = await MongoClient.connect(url, { useNewUrlParser: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const data = await collection.find().toArray();
    client.close();
    return data;
}

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());
app.get('/types', (req, res) => {
    const result = query('pokemontypes');
    result.then((r) => {
        res.send(r);
    });
});

app.get('/pokemons', (req, res) => {
    const result = query('pokemonlist');
    result.then((r) => {
        res.send(r);
    });
});


app.listen(process.env.PORT || 8081);
