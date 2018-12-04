interface Attack {
    type: string;
    damage: number;
    name?: string;
}

export class MyPokemon {
    constructor(
        public pokemonid: number,
        public cp: number,
        public hp: number,
        public fastattack: Attack,
        public chargedattack: Attack,
        public nickname?: string,
        public types?: string[],
        public _id?: string
    ) { }
}
