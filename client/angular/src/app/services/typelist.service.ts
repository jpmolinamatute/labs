import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



import { environment } from '../../environments/environment';
import { PokemonType } from '../classes/type';
import { ServiceStatus } from '../classes/serviceStatus';
@Injectable({
    providedIn: 'root'
})
export class TypelistService {
    private readonly pokemonUrl = `${environment.myEndpoint}/api/typelist`;
    private list: PokemonType[] = [];
    private iSeeYou: Observable<ServiceStatus>;
    constructor(private http: HttpClient) {
        this.iSeeYou = new Observable((observer) => {
            observer.next({ status: 'calling' });
            this.http.get(this.pokemonUrl).subscribe((data: PokemonType[]) => {
                this.list = data;
                observer.next({ status: 'ready' });
                observer.complete();
            });
        });
    }

    init(): Observable<ServiceStatus> {
        return this.iSeeYou;
    }
    getPokemonTypes() {
        return this.list;
    }
}
