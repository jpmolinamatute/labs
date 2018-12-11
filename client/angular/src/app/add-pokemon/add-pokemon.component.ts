import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PokemonlistService } from '../pokemonlist.service';
import { TypelistService } from '../typelist.service';
import { PokemonType } from '../type';
import { MypokemonsService } from '../mypokemons.service';
import { Pokemon } from '../pokemon';
import { MyPokemon } from '../mypokemon';

interface PokemonFiler {
    name: string;
    index: number;
}
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
    selector: 'app-add-pokemon',
    templateUrl: './add-pokemon.component.html',
    styleUrls: ['./add-pokemon.component.css']
})
export class AddPokemonComponent implements OnInit {
    pokemonsList: Pokemon[];
    typesList: PokemonType[];
    pokemonsFiltered: PokemonFiler[] = [];
    indexSeleted = 0;
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
        private myPokemonService: MypokemonsService
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
        const regexLETTER = /Key[ABCDEFGHIJKLMNOPQRSTUVWXYZ]/;
        if (event.code === 'Enter' &&
            typeof this.pokemonsFiltered[this.indexSeleted] === 'object' &&
            typeof this.pokemonsFiltered[this.indexSeleted].name === 'string') {
            this.addPokemonName(this.pokemonsFiltered[this.indexSeleted].name);
        } else if (regexLETTER.test(event.code)) {
            const name = filterName(event.target.value);
            if (typeof name === 'string' && name.length > 2) {
                this.pokemonsFiltered = [];
                const re = new RegExp(name);
                let index = 0;
                this.pokemonsList.forEach((pokemon) => {
                    if (re.test(pokemon.name)) {
                        this.pokemonsFiltered.push({
                            name: pokemon.name,
                            index
                        });
                        index += 1;
                    }
                });
            }
        }
    }
    selectPokemon(event) {
        if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
            if (event.code === 'ArrowDown' && this.indexSeleted < this.pokemonsFiltered.length - 1) {
                this.indexSeleted += 1;
            } else if (event.code === 'ArrowUp' && this.indexSeleted > 0) {
                this.indexSeleted -= 1;
            }
            event.preventDefault();
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


        const pokemonid = this.pokemonService.getPokemonId(pokemonname);
        if (typeof pokemonid === 'number') {
            const types = this.pokemonService.queryList(pokemonid, 'types');
            const name = this.pokemonService.queryList(pokemonid, 'name');
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
            const nickNameFiltered = filterName(nickname);
            const pokemon = new MyPokemon(
                pokemonid,
                cp,
                hp,
                fastattack,
                chargedattack,
                types,
                name,
                nickNameFiltered
            );
            this.myPokemonService.addPokemon(pokemon).subscribe((result) => {
                if (result.ok === 1) {
                    pokemonForm.reset(resetValue);
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
        this.indexSeleted = 0;
    }
}
