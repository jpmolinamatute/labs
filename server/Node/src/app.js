const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;


const app = express();
const dbName = 'pokedex';
const url = `mongodb://pokemon:dev@naruto:57017/${dbName}`;
const port = process.env.PORT || 8081;
const query = async (collectionName, queryField = {}, fields = {}, sort = { _id: 1 }) => {
    const client = await MongoClient.connect(url, { useNewUrlParser: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const data = await collection.find(queryField, fields).sort(sort).toArray();
    client.close();
    return data;
};

const write = async (collectionName, data) => {
    const client = await MongoClient.connect(url, { useNewUrlParser: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const response = await collection.insertOne(data);
    client.close();
    return response;
};

const del = async (collectionName, queryField) => {
    const client = await MongoClient.connect(url, { useNewUrlParser: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const response = await collection.deleteOne(queryField);
    client.close();
    return response;
};


function mergePokemonData(pokemons, myPokemons, callback) {
    const merged = [];
    myPokemons.forEach((my) => {
        const _id = my._id.toString();
        pokemons.forEach((pokemon) => {
            if (my.pokemonid === pokemon.pokemonid) {
                const data = Object.assign(my, pokemon);
                data._id = _id;
                merged.push(data);
            }
        });
    });
    callback.send(merged);
}

function processDomesticated(result1, callback) {
    const pokemonsIDs = [];
    result1.forEach((pokemon) => {
        if (!pokemonsIDs.includes(pokemon.pokemonid)) {
            pokemonsIDs.push(pokemon.pokemonid);
        }
    });
    const queryDomesticaed = { pokemonid: { $in: pokemonsIDs } };
    const result2 = query('pokemonlist', queryDomesticaed, {}, {});
    result2.then((doc) => {
        mergePokemonData(doc, result1, callback);
    });
}

async function getpokemonTeam(against) {
    let team = null;

    if (Array.isArray(against) && against.length > 0) {
        const length = against.length;
        team = [];
        against.forEach((a) => {
            const item = {
                oponent: a,
                members1: db.pokemontypes.find({ efective: a }, { _id: 1 }).fetch(),
                members2: db.pokemontypes.find({ fair: a }, { _id: 1 }).fetch()
            };

            team.push(item);
        });
    }
    return team;
}


app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());


// app.get('/types/against/:against', (req, res) => {
//     let pokedexQuery = {};
//     if (typeof req.params.against === 'string') {
//         pokedexQuery.efective = req.params.against;
//     }


//     const result = query('pokemontypes');
//     result.then((r) => {
//         res.send(r);
//     });
// });

// app.get('/types', (req, res) => {
//     const result = query('pokemontypes');
//     result.then((r) => {
//         res.send(r);
//     });
// });


app.get('/api/allpokemons', (req, res) => {
    const result = query('pokemonlist', {}, {}, { name: 1 });
    result.then((r) => {
        res.send(r);
    });
});

app.get('/api/typelist', (req, res) => {
    const result = query('pokemontypes', {}, { _id: 1 });
    result.then((r) => {
        res.send(r);
    });
});

app.post('/api/mypokemons', (req, res) => {
    const result = write('domesticatedPokemon', req.body);
    result.then((r) => {
        res.send(r.result);
    });
});


app.get('/api/mypokemons', (req, res) => {
    let sort = { cp: -1 };
    if (typeof req.query.sort === 'string') {
        sort = {};
        sort[req.query.sort] = -1;
    }

    const result = query('domesticatedPokemon', {}, {}, sort);
    result.then((doc) => {
        res.send(doc);
    });
});

app.delete('/api/mypokemons', (req, res) => {
    if (typeof req.query._id === 'string') {
        const _id = { _id: new ObjectID.createFromHexString(req.query._id) };
        const response = del('domesticatedPokemon', _id);
        response.then((r) => {
            if (r.deletedCount === 0) {
                res.send({ status: 'failed' });
            } else {
                res.send({ status: 'done' });
            }
        });
    } else {
        res.send({ status: 'failed' });
    }
});
app.listen(port, () => {
    console.log(`Listening to  http://localhost:${port}`);
});
