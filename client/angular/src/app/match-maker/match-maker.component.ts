import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
    selector: 'app-match-maker',
    templateUrl: './match-maker.component.html',
    styleUrls: ['./match-maker.component.css']
})

export class MatchMakerComponent implements OnInit {
    list = []; // @FIXME: this should be a list of ALL pokemons
    idSelected: number[] = [];
    constructor(private _sanitizer: DomSanitizer) { }

    ngOnInit() {
    }
    getBackground(img) {
        return this._sanitizer.bypassSecurityTrustStyle(`url('assets/img/${img}.png')`);
    }
    updateList(_id: number): void {
        if (!this.idSelected.includes(_id) && this.idSelected.length < 6) {
            this.idSelected.push(_id);
        } else {
            this.idSelected = this.idSelected.filter((item) => item !== _id);
        }
    }
    getOpponents(): void {
        console.log(this.idSelected);
    }
}


// style="background-image: url('assets/img/{{_id}}.png');"
