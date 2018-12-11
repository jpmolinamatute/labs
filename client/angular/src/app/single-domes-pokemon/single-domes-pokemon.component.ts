import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PokemonlistService } from '../pokemonlist.service';
import { MyPokemon } from '../mypokemon';
import { MypokemonsService } from '../mypokemons.service';

@Component({
    selector: 'app-single-domes-pokemon',
    templateUrl: './single-domes-pokemon.component.html',
    styleUrls: ['./single-domes-pokemon.component.css']
})
export class SingleDomesPokemonComponent implements OnInit {
    @Input() pokemon: MyPokemon;
    @Input() displaySingle: boolean;
    @Output() closeSingle = new EventEmitter<boolean>();
    constructor(private pokemonListService: PokemonlistService, private myPokemonService: MypokemonsService) { }

    ngOnInit() {
    }
    // getPokemonType(pokemonid: number): string[] {
    //     return this.pokemonListService.queryList(pokemonid, 'types');
    // }
    edit(pokemon: MyPokemon): void {
        console.log(pokemon);

    }
    // getPokemonName(pokemonid: number): string {
    //     return this.pokemonListService.queryList(pokemonid, 'name');
    // }
    del(pokemon: MyPokemon): void {
        this.myPokemonService.removePokemon(pokemon._id)
            .subscribe(() => {
                this.closeSingle.emit(false);
            });
    }
    close() {
        this.closeSingle.emit(false);
    }
}
