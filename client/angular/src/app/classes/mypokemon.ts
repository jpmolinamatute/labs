import { Pokemon } from './pokemon';
interface Attack {
    type: string;
    damage: number;
    name?: string;
}

export interface MyPokemon {
    genericdata: Pokemon;
    cp: number;
    hp: number;
    fastattack: Attack;
    chargedattack: Attack;
    _id?: string;
    nickname?: string;
    hidden?: boolean;
}
