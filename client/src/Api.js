import axios from 'axios';
export default class API {
    constructor() {
        this.call = () => axios.create({
            baseURL: 'http://localhost:8081'
        });
    }
    fetchType(against) {
        return this.call().get(`type/against/${against}`);
    }
    fetchAllTypes() {
        return this.call().get(`types`);
    }
    fetchAllPokemons() {
        return this.call().get('pokemons')
    }
};
