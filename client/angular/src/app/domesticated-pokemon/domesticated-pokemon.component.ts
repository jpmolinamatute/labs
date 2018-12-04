import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MyPokemon } from '../mypokemon';
import { MypokemonsService } from '../mypokemons.service';

const myArray: MyPokemon[] = [];

@Component({
    selector: 'app-domesticated-pokemon',
    templateUrl: './domesticated-pokemon.component.html',
    styleUrls: ['./domesticated-pokemon.component.css']
})
export class DomesticatedPokemonComponent implements OnInit {
    domesticatedList: MyPokemon[] = myArray;

    constructor(private _sanitizer: DomSanitizer, private myPokemonService: MypokemonsService) { }

    ngOnInit() {
        this.getDomesticatedPokemons();
    }
    getImagePath() {
        return this._sanitizer.bypassSecurityTrustStyle('assets/img/types.badgets.jpg');
    }
    getDomesticatedPokemons(): void {
        this.myPokemonService.getDomesticatedPokemons()
            .subscribe((pokemons) => {
                console.log('Before this is');
                console.log(this.domesticatedList, pokemons);
                this.domesticatedList = this.domesticatedList.concat(pokemons);
                console.log('After this is');
                console.log(this.domesticatedList);
            });
    }

    edit(pokemon: MyPokemon): void {
        console.log(pokemon);

    }

    del(pokemon: MyPokemon): void {
        console.log(pokemon);
    }
}
