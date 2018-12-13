interface Attack {
    type: string;
    damage: number;
    name?: string;
}

export interface MyPokemon {
    pokemonid: number;
    cp: number;
    hp: number;
    fastattack: Attack;
    chargedattack: Attack;
    nickname?: string;
    types?: string[];
    name?: string;
    _id?: string;
    hidden?: boolean;
}
