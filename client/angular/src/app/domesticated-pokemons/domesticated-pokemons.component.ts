import { Component, OnInit } from '@angular/core';

import { MyPokemon } from '../mypokemon';
import { MypokemonsService } from '../mypokemons.service';
import { PokemonlistService } from '../pokemonlist.service';
import { TypelistService } from '../typelist.service';
import { PokemonType } from '../type';
import { SingleDomesPokemonComponent } from '../single-domes-pokemon/single-domes-pokemon.component';


@Component({
    providers: [SingleDomesPokemonComponent],
    selector: 'app-domesticated-pokemons',
    templateUrl: './domesticated-pokemons.component.html',
    styleUrls: ['./domesticated-pokemons.component.css']
})
export class DomesticatedPokemonsComponent implements OnInit {
    domesticatedList: MyPokemon[] = [];
    displaySingle = false;
    pokemon: MyPokemon;
    typesList: PokemonType[] = [];
    constructor(
        private myPokemonService: MypokemonsService,
        private pokemonListService: PokemonlistService,
        private typeService: TypelistService
    ) { }

    ngOnInit() {
        this.getDomesticatedPokemons();
        this.getTypeList();
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
        this.pokemon = pokemon;
        this.displaySingle = true;
    }
    closeSingle($event): void {
        this.displaySingle = $event;
        this.getDomesticatedPokemons();
    }
    getTypeList(): void {
        this.typeService.getPokemonTypes()
            .subscribe(types => this.typesList = types.map((t) => {
                t.selected = true;
                return t;
            }));
    }
}
