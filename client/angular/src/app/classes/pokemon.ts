import { Types } from './displayTypes';

interface Effectiveness {
    fair: Types[];
    inefective: Types[];
    none: Types[];
    efective: Types[];
}

export interface Pokemon {
    _id: string;
    pokemonid: number;
    generation: number;
    legendary: boolean;
    types: string[];
    effectiveness: Effectiveness
}
