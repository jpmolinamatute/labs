export enum Types {
    DRAGON = "dragon",
    FAIRY = "fairy",
    FIGHTING = "fighting",
    FIRE = "fire",
    ELECTRIC = "electric",
    FLYING = "flying",
    GRASS = "grass",
    GROUND = "ground",
    ICE = "ice",
    NORMAL = "normal",
    POISON = "poison",
    PSYCHIC = "psychic",
    GHOST = "ghost",
    STEEL = "steel",
    BUG = "bug",
    WATER = "water",
    DARK = "dark",
    ROCK = "rock",
}

export interface TypeElement {
    type: Types;
    selected: boolean
}

export const typeList: TypeElement[] = [
    { type: Types.DRAGON, selected: true },
    { type: Types.FAIRY, selected: true },
    { type: Types.FIGHTING, selected: true },
    { type: Types.FIRE, selected: true },
    { type: Types.ELECTRIC, selected: true },
    { type: Types.FLYING, selected: true },
    { type: Types.GRASS, selected: true },
    { type: Types.GROUND, selected: true },
    { type: Types.ICE, selected: true },
    { type: Types.NORMAL, selected: true },
    { type: Types.POISON, selected: true },
    { type: Types.PSYCHIC, selected: true },
    { type: Types.GHOST, selected: true },
    { type: Types.STEEL, selected: true },
    { type: Types.BUG, selected: true },
    { type: Types.WATER, selected: true },
    { type: Types.DARK, selected: true },
    { type: Types.ROCK, selected: true }
];
