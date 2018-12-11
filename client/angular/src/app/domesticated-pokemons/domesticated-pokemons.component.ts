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
    pokemonOrder = 'cp';
    constructor(
        private myPokemonService: MypokemonsService,
        private pokemonListService: PokemonlistService,
        private typeService: TypelistService
    ) { }

    ngOnInit() {
        this.getDomesticatedPokemons(this.pokemonOrder);
        this.getTypeList();
    }

    getDomesticatedPokemons(sort: string): void {
        this.myPokemonService.getDomesticatedPokemons(sort).subscribe((pokemons) => {
            this.domesticatedList = pokemons;
        });
    }
    hideShow(ptype) {
        ptype.selected = !ptype.selected;
        this.domesticatedList = this.domesticatedList.map((pokemon) => {
            const types = this.pokemonListService.queryList(pokemon.pokemonid, 'types');
            if (types.includes(ptype._id)) {
                pokemon.hidden = !ptype.selected;
            }
            return pokemon;
        });
    }
    getPokemonName(pokemonid: number): string {
        return this.pokemonListService.queryList(pokemonid, 'name');
    }
    changeOrder(sort: string) {
        this.pokemonOrder = sort;
        this.getDomesticatedPokemons(this.pokemonOrder);
    }
    displaySigle(pokemon: MyPokemon): void {
        this.pokemon = pokemon;
        this.displaySingle = true;
    }
    closeSingle($event): void {
        this.displaySingle = $event;
        this.getDomesticatedPokemons(this.pokemonOrder);
    }
    getTypeList(): void {
        this.typeService.getPokemonTypes()
            .subscribe(types => this.typesList = types.map((t) => {
                t.selected = true;
                return t;
            }));
    }
}
