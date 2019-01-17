import { Component, OnInit } from '@angular/core';
import { MypokemonsService } from '../services/mypokemons.service';
import { ServiceStatus } from '../classes/serviceStatus';
import { MyPokemon } from '../classes/mypokemon';
import { Types, TypeElement, typeList } from '../classes/displayTypes';

@Component({
    selector: 'app-display-domesticated',
    templateUrl: './display-domesticated.component.html',
    styleUrls: ['./display-domesticated.component.css']
})
export class DisplayDomesticatedComponent implements OnInit {
    domesticatedList: MyPokemon[] = [];
    tList = typeList;
    pokemonOrder = 'cp';
    newEditTemplate = 'none';
    displaySummary = false;
    model: MyPokemon;
    constructor(
        private myPokemonService: MypokemonsService
    ) { }

    ngOnInit() {
        this.getDomesticatedPokemons(this.pokemonOrder);
    }

    getDomesticatedPokemons(sort: string): void {
        this.myPokemonService.getDomesticatedPokemons(sort).subscribe((pokemons) => {
            this.domesticatedList = pokemons;
        });
    }
    changeOrder(sort: string) {
        this.pokemonOrder = sort;
        this.getDomesticatedPokemons(this.pokemonOrder);
    }

    hideShow(ptype: TypeElement) {
        ptype.selected = !ptype.selected;
        this.domesticatedList = this.domesticatedList.map((pokemon) => {
            if (pokemon.genericdata.types.includes(ptype.type)) {
                pokemon.hidden = !ptype.selected;
            }
            return pokemon;
        });
    }
    updateList(response: ServiceStatus) {
        if (response.status === 'done') {
            this.getDomesticatedPokemons(this.pokemonOrder);
        }
    }
    edit(pokemon: MyPokemon) {
        this.model = pokemon;
        this.newEditTemplate = 'block';
    }
}
