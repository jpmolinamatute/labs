import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PokemonlistService } from '../pokemonlist.service';
import { TypelistService } from '../typelist.service';
import { MypokemonsService } from '../mypokemons.service';
import { DomesticatedPokemonComponent } from '../domesticated-pokemon/domesticated-pokemon.component';
import { Pokemon } from '../pokemon';
import { MyPokemon } from '../mypokemon';


const resetValue = {
    pokemonname: '',
    chargedattacktype: 'none',
    fastattacktype: 'none'
};
function filterName(str) {
    let filteredStr = null;
    if (typeof str === 'string' && str.trim().length > 0) {
        filteredStr = str.toLowerCase().trim();
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
    typesList: string[];
    pokemonsFiltered: string[] = [];
    model = {
        pokemonname: '',
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
    onKey(event: any): void {
        const name = filterName(event.target.value);
        this.pokemonsFiltered = [];
        if (name !== null) {
            const re = new RegExp(name);
            this.pokemonsList.forEach((pokemon) => {
                if (re.test(pokemon.name)) {
                    this.pokemonsFiltered.push(pokemon.name);
                }
            });
        }

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
            pokemonname
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
        const name = filterName(nickname);
        const pokemonid = this.pokemonService.getPokemonId(pokemonname);
        if (typeof pokemonid === 'number') {
            const pokemon = new MyPokemon(
                pokemonid,
                cp,
                hp,
                fastattack,
                chargedattack,
                name
            );
            this.myPokemonService.addPokemon(pokemon).subscribe((result) => {
                if (result.ok === 1) {
                    pokemonForm.reset(resetValue);
                    this.domesticated.getDomesticatedPokemons();
                    document.getElementById('new-pokemon').focus();
                } else {
                    console.error('Error: something went wrong when inserting a pokemon');
                }
            });
        }

    }

    addPokemonName(pokemon: string): void {
        this.model.pokemonname = pokemon;
        this.pokemonsFiltered = [];
    }
}
