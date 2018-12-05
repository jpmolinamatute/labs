import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PokemonlistService } from '../pokemonlist.service';
import { TypelistService } from '../typelist.service';
import { MypokemonsService } from '../mypokemons.service';
import { DomesticatedPokemonComponent } from '../domesticated-pokemon/domesticated-pokemon.component';
import { Pokemon } from '../pokemon';
import { MyPokemon } from '../mypokemon';


const resetValue = {
    pokemonid: -1,
    chargedattacktype: 'none',
    fastattacktype: 'none',
    chargedattackdamage: 0,
    fastattackdamage: 0,
    hp: 0,
    cp: 0
};
function filterName(str) {
    let filteredStr;
    if (typeof str === 'string' && str.length > 0) {
        filteredStr = str.toLowerCase();
    }
    return filteredStr;
}
@Component({
    providers: [DomesticatedPokemonComponent],
    selector: 'app-add-pokemon',
    templateUrl: './add-pokemon.component.html',
    styleUrls: ['./add-pokemon.component.css']
})
export class AddPokemonComponent implements OnInit {
    pokemonsList: Pokemon[];
    typesList: String[];
    model = {
        pokemonid: -1,
        chargedattack: {
            type: 'none'
        },
        fastattack: {
            type: 'none'
        }
    };

    constructor(
        private pokemonService: PokemonlistService,
        private typeService: TypelistService,
        private myPokemonService: MypokemonsService,
        private domesticated: DomesticatedPokemonComponent
    ) { }

    ngOnInit() {
        this.getPokemonsList();
        this.getTypeList();
    }
    getPokemonsList(): void {
        this.pokemonService.getAllPokemons()
            .subscribe(pokemons => this.pokemonsList = pokemons);
    }
    getTypeList(): void {
        this.typeService.getPokemonTypes()
            .subscribe(types => this.typesList = types);
    }
    clearForm(pokemonForm: NgForm): void {
        pokemonForm.reset(resetValue);
    }
    savePokemon(pokemonForm: NgForm): void {
        const {
            chargedattackdamage,
            chargedattackname,
            chargedattacktype,
            cp,
            hp,
            fastattackdamage,
            fastattackname,
            fastattacktype,
            nickname,
            pokemonid
        } = pokemonForm.control.value;

        const fastattack = {
            type: fastattacktype,
            damage: +fastattackdamage,
            name: filterName(fastattackname)
        };
        const chargedattack = {
            type: chargedattacktype,
            damage: +chargedattackdamage,
            name: filterName(chargedattackname)
        };
        const pokemon = new MyPokemon(
            +pokemonid,
            cp,
            hp,
            fastattack,
            chargedattack,
            nickname
        );
        this.myPokemonService.addPokemon(pokemon).subscribe((result) => {
            if (result.ok === 1) {
                pokemonForm.reset(resetValue);
                console.log('After Subscribe but before getDomesticatedPokemons()');

                this.domesticated.getDomesticatedPokemons();
            } else {
                console.error('Error: something went wrong when inserting a pokemon');
            }
        });
    }
}
