import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MyPokemon } from '../classes/mypokemon';
import { ServiceStatus } from '../classes/serviceStatus';
import { SingleDomesPokemonComponent } from '../single-domes-pokemon/single-domes-pokemon.component';

@Component({
    providers: [SingleDomesPokemonComponent],
    selector: 'app-domesticated-summary',
    templateUrl: './domesticated-summary.component.html',
    styleUrls: ['./domesticated-summary.component.css']
})
export class DomesticatedSummaryComponent implements OnInit {

    displaySingle = false;
    pokemon: MyPokemon;
    @Input() domesticatedList: MyPokemon[]
    @Output() onDone = new EventEmitter<ServiceStatus>();
    constructor() { }

    ngOnInit() { }

    displaySigle(pokemon: MyPokemon): void {
        this.pokemon = pokemon;
        this.displaySingle = true;
    }

    closeSingle(response: ServiceStatus): void {

        if (response.status === 'done') {
            this.displaySingle = false;
            this.onDone.emit(response)
        }
    }

}
