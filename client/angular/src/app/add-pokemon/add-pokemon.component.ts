import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PokemonlistService } from '../services/pokemonlist.service';
import { PokemonType } from '../classes/type';
import { MypokemonsService } from '../services/mypokemons.service';
import { MyPokemon } from '../classes/mypokemon';
import { ServiceStatus } from '../classes/serviceStatus';

interface PokemonFiler {
    name: string
    index: number;
}
const resetValue = {
    pokemonname: '',
    chargedattacktype: 'none',
    fastattacktype: 'none'
};

function filterName(str: string) {
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
    pokemonsList: string[] = [];
    typesList: PokemonType[];
    pokemonsFiltered: PokemonFiler[] = [];
    indexSeleted = 0;
    @Input() model: MyPokemon;

    constructor(
        private pokemonService: PokemonlistService,
        private myPokemonService: MypokemonsService
    ) { }

    ngOnInit() {
        const pokemonSubscriber = this.pokemonService.init();
        pokemonSubscriber.subscribe((status) => {
            if (status.status === 'ready') {
                this.getPokemonsList();
            }
        });

    }
    getPokemonsList(): void {
        this.pokemonsList = this.pokemonService.getAllPokemonsName();
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
                this.resetName();
                const re = new RegExp(name);
                let index = 0;
                this.pokemonsList.forEach((pokemonname) => {
                    if (re.test(pokemonname)) {
                        this.pokemonsFiltered.push({
                            name: pokemonname,
                            index
                        });
                        index += 1;
                    }
                });
            }
        }
    }
    selectPokemon(event: any) {
        if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
            if (event.code === 'ArrowDown' && this.indexSeleted < this.pokemonsFiltered.length - 1) {
                this.indexSeleted += 1;
            } else if (event.code === 'ArrowUp' && this.indexSeleted > 0) {
                this.indexSeleted -= 1;
            }
            event.preventDefault();
        }
    }
    resetName() {
        this.pokemonsFiltered = [];
        this.indexSeleted = 0;

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
            rawnickname,
            pokemonname
        } = pokemonForm.control.value;

        const pokemonData = this.pokemonService.getPokemonByName(pokemonname);

        // if (typeof pokemonData === 'object') {
        //     const pokemon: MyPokemon = {
        //         cp: +cp,
        //         hp: +hp,
        //         fastattack: {
        //             type: fastattacktype,
        //             damage: +fastattackdamage,
        //             name: filterName(fastattackname)
        //         },
        //         chargedattack: {
        //             type: chargedattacktype,
        //             damage: +chargedattackdamage,
        //             name: filterName(chargedattackname)
        //         },
        //         nickname: filterName(rawnickname)
        //     };

        //     this.myPokemonService.addPokemon(pokemon).subscribe((result) => {
        //         if (result.ok === 1) {
        //             pokemonForm.reset(resetValue);
        //             document.getElementById('new-pokemon').focus();
        //         } else {
        //             console.error('Error: something went wrong when inserting a pokemon');
        //         }
        //     });
        // }

    }

    addPokemonName(pokemon: string): void {
        // this.model.name = pokemon;
        this.resetName();
    }
}
