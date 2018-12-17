import { Component, OnInit, Input } from '@angular/core';

import { MyPokemon } from '../classes/mypokemon';

import { SingleDomesPokemonComponent } from '../single-domes-pokemon/single-domes-pokemon.component';

@Component({
    providers: [SingleDomesPokemonComponent],
    selector: 'app-domesticated-pokemons',
    templateUrl: './domesticated-pokemons.component.html',
    styleUrls: ['./domesticated-pokemons.component.css']
})
export class DomesticatedPokemonsComponent implements OnInit {

    displaySingle = false;
    pokemon: MyPokemon;
    @Input() pokemonOrder: string;
    @Input() domesticatedList: MyPokemon[]

    constructor() { }

    ngOnInit() { }

    displaySigle(pokemon: MyPokemon): void {
        this.pokemon = pokemon;
        this.displaySingle = true;
    }

    closeSingle(display: boolean): void {
        this.displaySingle = display;
        // this.getDomesticatedPokemons(this.pokemonOrder);
    }

}
