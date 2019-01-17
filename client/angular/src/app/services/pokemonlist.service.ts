import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Pokemon } from '../classes/pokemon';
import { Observable } from 'rxjs';
import { ServiceStatus } from '../classes/serviceStatus';


@Injectable({
    providedIn: 'root'
})
export class PokemonlistService {
    private readonly baseURL = `${environment.myEndpoint}/api/allpokemons`;
    private list: Pokemon[] = [];
    private iSeeYou: Observable<ServiceStatus>;

    constructor(private http: HttpClient) {
        this.iSeeYou = new Observable((observer) => {
            observer.next({ status: 'calling' });
            this.http.get(this.baseURL).subscribe((data: Pokemon[]) => {
                this.list = data;
                observer.next({ status: 'ready' });
                observer.complete();
            });
        });
    }

    init(): Observable<ServiceStatus> {
        return this.iSeeYou;
    }

    getPokemonById(id: number): Pokemon {
        let info: Pokemon;
        this.list.forEach((item) => {
            if (item.pokemonid === id) {
                info = item;
            }
        });
        return info;
    }

    getPokemonByName(name: string): Pokemon {
        let info: Pokemon;
        this.list.forEach((item) => {
            if (item._id === name) {
                info = item;
            }
        });
        return info;
    }
    getAllPokemonsName(): string[] {
        return this.list.map((item) => item._id);
    }
}
