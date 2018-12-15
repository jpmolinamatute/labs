import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MyPokemon } from '../classes/mypokemon';
import { MypokemonsService } from '../services/mypokemons.service';

@Component({
    selector: 'app-single-domes-pokemon',
    templateUrl: './single-domes-pokemon.component.html',
    styleUrls: ['./single-domes-pokemon.component.css']
})
export class SingleDomesPokemonComponent implements OnInit {
    @Input() pokemon: MyPokemon;
    @Input() displaySingle: boolean;
    @Output() closeSingle = new EventEmitter<boolean>();
    constructor(private myPokemonService: MypokemonsService) { }

    ngOnInit() {
    }

    edit(pokemon: MyPokemon): void {
        console.log(pokemon);

    }

    del(pokemon: MyPokemon): void {
        this.myPokemonService.removePokemon(pokemon._id)
            .subscribe((response) => {
                if (response.status === 'OK') {
                    this.closeSingle.emit(false);
                }
            });
    }
    close() {
        this.closeSingle.emit(false);
    }
}
