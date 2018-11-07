import axios from 'axios';
export default class API {
    constructor() {
        this.call = () => axios.create({
            baseURL: 'http://localhost:8081'
        });
    }
    fetchTypes(against) {
        console.log(against);
        return this.call().get(`types/against/${against}`);
    }
    fetchPokemons() {
        return this.call().get('pokemons')
    }
};
