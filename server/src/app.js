const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const MongoClient = require('mongodb').MongoClient;


const app = express();
const dbName = 'pokedex';
const url = `mongodb://pokemon:dev@naruto:57017/${dbName}`;

const query = async (collectionName, query = {}, fields = {}, sort = { _id: 1 }) => {
    const client = await MongoClient.connect(url, { useNewUrlParser: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const data = await collection.find(query, fields).sort(sort).toArray();
    client.close();
    return data;
}

const write = async (collectionName, data) => {
    const client = await MongoClient.connect(url, { useNewUrlParser: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const response = await collection.insertOne(data);
    client.close();
    return response;
};

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
    const result = query('pokemonlist', {}, { _id: 1, name: 1, types: 1 }, { name: 1 });
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
    const result = query('domesticatedPokemon', {}, {}, { pokemonid: 1 });
    result.then((doc) => {
        const domesticatedPokemonList = [];
        doc.forEach((pokemon) => {
            if (!domesticatedPokemonList.includes(pokemon.pokemonid)) {
                domesticatedPokemonList.push(pokemon.pokemonid);
            }
        });

        if (domesticatedPokemonList.length > 0) {
            const queryField = { _id: { $in: domesticatedPokemonList } };
            const fieldsField = { _id: 1, name: 1, types: 1 };
            const allPokemons = query('pokemonlist', queryField, fieldsField);
            allPokemons.then((allDoc) => {
                const mergePokemons = doc.map((pokemon) => {
                    allDoc.forEach((innerAll) => {
                        if (innerAll._id === pokemon.pokemonid) {
                            pokemon.types = innerAll.types;
                            if (typeof pokemon.nickname === 'undefined') {
                                pokemon.nickname = innerAll.name;
                            }
                        }
                    });
                    return pokemon;
                });
                res.send(mergePokemons);
            });
        } else {
            res.send(doc);
        }
    });
});

app.listen(process.env.PORT || 8081);
