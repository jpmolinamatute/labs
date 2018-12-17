import { Component, OnInit, Input } from '@angular/core';
import { MyPokemon } from '../classes/mypokemon';

@Component({
    selector: 'app-domesticated-detail',
    templateUrl: './domesticated-detail.component.html',
    styleUrls: ['./domesticated-detail.component.css']
})
export class DomesticatedDetailComponent implements OnInit {
    @Input() domesticatedList: MyPokemon[]
    constructor() { }

    ngOnInit() {
    }

}
