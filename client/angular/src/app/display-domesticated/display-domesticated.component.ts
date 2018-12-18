import { Component, OnInit } from '@angular/core';
import { MypokemonsService } from '../services/mypokemons.service';
import { TypelistService } from '../services/typelist.service';
import { PokemonType } from '../classes/type';
import { ServiceStatus } from '../classes/serviceStatus';
import { MyPokemon } from '../classes/mypokemon';

@Component({
    selector: 'app-display-domesticated',
    templateUrl: './display-domesticated.component.html',
    styleUrls: ['./display-domesticated.component.css']
})
export class DisplayDomesticatedComponent implements OnInit {
    domesticatedList: MyPokemon[] = [];
    typesList: PokemonType[] = [];
    pokemonOrder = 'cp';
    newEditTemplate = 'none';
    displaySummary = true;

    constructor(
        private myPokemonService: MypokemonsService,
        private typeService: TypelistService
    ) { }

    ngOnInit() {
        this.getDomesticatedPokemons(this.pokemonOrder);
        const typeSubscriber = this.typeService.init();
        typeSubscriber.subscribe((status: ServiceStatus) => {
            if (status.status === 'ready') {
                this.getTypeList();
            }
        });
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
    getTypeList(): void {
        const types = this.typeService.getPokemonTypes();
        this.typesList = types.map((t) => {
            t.selected = true;
            return t;
        });
    }

    hideShow(ptype: PokemonType) {
        ptype.selected = !ptype.selected;
        this.domesticatedList = this.domesticatedList.map((pokemon) => {
            if (pokemon.types.includes(ptype._id)) {
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
}
