/* global
db: false,
print: false,
printjson: false
*/
const pokemonArray = db.pokemonlist.find({}, { _id: 1, types: 1 }).toArray();
pokemonArray.forEach((pokemon) => {
    const _id = pokemon._id;
    const effectiveness = {
        fair: [],
        inefective: [],
        none: [],
        efective: []
    };
    pokemon.types.forEach((type) => {
        print(`${_id}    ${type}`);
        const typeObj = db.pokemontypes.findOne({ _id: type }, { _id: 0 });
        typeObj.fair.forEach((efe) => {
            if (!effectiveness.fair.includes(efe)) {
                effectiveness.fair.push(efe);
            }
        });
        typeObj.inefective.forEach((efe) => {
            if (!effectiveness.inefective.includes(efe)) {
                effectiveness.inefective.push(efe);
            }
        });
        typeObj.none.forEach((efe) => {
            if (!effectiveness.none.includes(efe)) {
                effectiveness.none.push(efe);
            }
        });
        typeObj.efective.forEach((efe) => {
            if (!effectiveness.efective.includes(efe)) {
                effectiveness.efective.push(efe);
            }
        });
    });
    db.pokemonlist.update({ _id }, { $set: { effectiveness } });
    print('  ');
});
