import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MyPokemon } from '../classes/mypokemon';
import { MypokemonsService } from '../services/mypokemons.service';
import { ServiceStatus } from '../classes/serviceStatus';

@Component({
    selector: 'app-domesticated-detail',
    templateUrl: './domesticated-detail.component.html',
    styleUrls: ['./domesticated-detail.component.css']
})
export class DomesticatedDetailComponent implements OnInit {
    @Input() domesticatedList: MyPokemon[];
    @Output() onDone = new EventEmitter<ServiceStatus>();

    constructor(private myPokemonService: MypokemonsService) { }

    ngOnInit() {
    }

    edit(pokemon: MyPokemon) {

    }

    del(pokemon: MyPokemon) {
        this.myPokemonService.removePokemon(pokemon._id)
            .subscribe((response) => this.onDone.emit(response));
    }
}
