import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MyPokemon } from '../classes/mypokemon';
import { MypokemonsService } from '../services/mypokemons.service';
import { ServiceStatus } from '../classes/serviceStatus';
@Component({
    selector: 'app-single-domes-pokemon',
    templateUrl: './single-domes-pokemon.component.html',
    styleUrls: ['./single-domes-pokemon.component.css']
})
export class SingleDomesPokemonComponent implements OnInit {
    @Input() pokemon: MyPokemon;
    @Input() displaySingle: boolean;
    @Output() onDone = new EventEmitter<ServiceStatus>();
    constructor(private myPokemonService: MypokemonsService) { }

    ngOnInit() {
    }

    edit(pokemon: MyPokemon): void {
        console.log(pokemon);

    }

    del(pokemon: MyPokemon) {
        this.myPokemonService.removePokemon(pokemon._id)
            .subscribe((response: ServiceStatus) => this.onDone.emit(response));
    }
    close() {
        this.onDone.emit({ status: 'done' });
    }
}
