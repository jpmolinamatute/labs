import { Pokemon } from './pokemon';
interface Attack {
    type: string;
    damage: number;
    name?: string;
}

export class MyPokemon extends Pokemon {
    constructor(
        public pokemonid: number,
        public cp: number,
        public hp: number,
        public fastattack: Attack,
        public chargedattack: Attack,
        public types: string[],
        public name: string,
        public nickname?: string,
        public _id?: string,
        public hidden?: boolean
    ) {
        super(pokemonid, name, types);
    }
}
