import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Pokemon } from '../classes/pokemon';
import { Observable } from 'rxjs';

interface IsReady {
    ready: boolean;
}


@Injectable({
    providedIn: 'root'
})
export class PokemonlistService {
    private pokemonUrl = `${environment.myEndpoint}/api/allpokemons`;
    private list: Pokemon[] = [];
    constructor(private http: HttpClient) { }

    init(): Observable<IsReady> {
        return new Observable((observer) => {
            if (this.list.length === 0) {
                observer.next({ ready: false });

                this.http.get<Pokemon[]>(this.pokemonUrl).subscribe((data) => {
                    this.list = data;
                    observer.next({ ready: true });
                    observer.complete();

                });
            } else {
                observer.next({ ready: true });
            }
        });
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
            if (item.name === name) {
                info = item;
            }
        });
        return info;
    }
    getAllPokemonsName(): string[] {
        return this.list.map((item) => item.name);
    }
}
