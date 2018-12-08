import { Component, OnInit } from '@angular/core';

import { MyPokemon } from '../mypokemon';
import { MypokemonsService } from '../mypokemons.service';
import { PokemonlistService } from '../pokemonlist.service';
import { SingleDomesPokemonComponent } from '../single-domes-pokemon/single-domes-pokemon.component';

const myArray: MyPokemon[] = [];

@Component({
    providers: [SingleDomesPokemonComponent],
    selector: 'app-domesticated-pokemons',
    templateUrl: './domesticated-pokemons.component.html',
    styleUrls: ['./domesticated-pokemons.component.css']
})
export class DomesticatedPokemonsComponent implements OnInit {
    domesticatedList: MyPokemon[] = myArray;
    displaySingle: any;
    constructor(
        private myPokemonService: MypokemonsService,
        private pokemonListService: PokemonlistService
    ) { }

    ngOnInit() {
        this.getDomesticatedPokemons();
    }

    getDomesticatedPokemons(): void {
        const that = this;
        const observable = this.myPokemonService.getDomesticatedPokemons();
        observable.subscribe((pokemons) => {
            that.domesticatedList = pokemons;
        });
    }

    getPokemonName(pokemonid: number): string {
        return this.pokemonListService.queryList(pokemonid, 'name');
    }

    displaySigle(pokemon: MyPokemon): void {
        this.displaySingle = pokemon;
    }
}
