import axios from 'axios';
export default class API {
    constructor() {
        this.call = () => axios.create({
            baseURL: 'http://localhost:8081'
        });
    }
    fetchTypes() {
        return this.call().get('types');
    }
    fetchPokemons() {
        return this.call().get('pokemons')
    }
};
