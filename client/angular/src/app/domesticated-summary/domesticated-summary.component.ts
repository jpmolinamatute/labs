import { Component, OnInit, Input } from '@angular/core';

import { MyPokemon } from '../classes/mypokemon';

import { SingleDomesPokemonComponent } from '../single-domes-pokemon/single-domes-pokemon.component';

@Component({
    providers: [SingleDomesPokemonComponent],
    selector: 'app-domesticated-summary',
    templateUrl: './domesticated-summary.component.html',
    styleUrls: ['./domesticated-summary.component.css']
})
export class DomesticatedSummaryComponent implements OnInit {

    displaySingle = false;
    pokemon: MyPokemon;
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
