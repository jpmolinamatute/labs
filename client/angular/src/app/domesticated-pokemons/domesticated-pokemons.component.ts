import { Component, OnInit } from '@angular/core';

import { MyPokemon } from '../classes/mypokemon';
import { MypokemonsService } from '../services/mypokemons.service';
import { TypelistService } from '../services/typelist.service';
import { PokemonType } from '../classes/type';
import { SingleDomesPokemonComponent } from '../single-domes-pokemon/single-domes-pokemon.component';
import { ServiceStatus } from '../classes/serviceStatus';

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
        private typeService: TypelistService
    ) { }

    ngOnInit() {
        this.getDomesticatedPokemons(this.pokemonOrder);
        const typeSubscriber = this.typeService.init();
        console.log('DomesticatedPokemonsComponent.ngOnInit()');
        typeSubscriber.subscribe((status: ServiceStatus) => {
            console.log('DomesticatedPokemonsComponent.ngOnInit() data changed ', status);
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
    hideShow(ptype) {
        ptype.selected = !ptype.selected;
        this.domesticatedList = this.domesticatedList.map((pokemon) => {
            if (pokemon.types.includes(ptype._id)) {
                pokemon.hidden = !ptype.selected;
            }
            return pokemon;
        });
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
        const types = this.typeService.getPokemonTypes();
        this.typesList = types.map((t) => {
            t.selected = true;
            return t;
        });
    }
}
