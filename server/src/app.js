const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const MongoClient = require('mongodb').MongoClient;


const app = express();
const dbName = 'pokedex';
const url = `mongodb://pokemon:dev@naruto:57017/${dbName}`;
const query = async (collectionName, query = {}, opt = {}) => {
    const client = await MongoClient.connect(url, { useNewUrlParser: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const data = await collection.find(query, opt).toArray();
    client.close();
    return data;
}

async function getpokemonTeam(against) {
    let team = null;

    if (Array.isArray(against) && against.length > 0) {
        const length = against.length;
        team = []
        against.forEach((a) => {
            const item = {
                oponent: a,
                members1: db.pokemontypes.find({ efective: a }, { _id: 1 }).fetch(),
                members2: db.pokemontypes.find({ fair: a }, { _id: 1 }).fetch()
            };

            team.push(item);
        });

        team = 5;
    }
    return team;
}


app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());


app.get('/types/against/:against', (req, res) => {
    let pokedexQuery = {};
    if (typeof req.params.against === 'string') {
        pokedexQuery.efective = req.params.against;
    }


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
