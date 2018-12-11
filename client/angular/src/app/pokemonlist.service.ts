import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Pokemon } from './pokemon';
import { environment } from '../environments/environment';
import { MessageService } from './message.service';

@Injectable({
    providedIn: 'root'
})
export class PokemonlistService {
    private pokemonUrl = `${environment.myEndpoint}/api/allpokemons`;  // URL to web api
    private list: Pokemon[] = [];
    constructor(private http: HttpClient, private messageService: MessageService) {
        this.http.get<Pokemon[]>(this.pokemonUrl).subscribe((data) => {
            this.list = data;
        });
    }
    private log(message: string) {
        this.messageService.add(`PokemonlistService: ${message}`);
    }
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
    getPokemonId(name: string): number {
        let info;
        this.list.forEach((item) => {
            if (item.name === name) {
                info = item.pokemonid;
            }
        });
        return info;
    }
    queryList(pokemonid: number, field: string, regex?: boolean) {
        let info;
        this.list.forEach((item) => {
            if (item.pokemonid === pokemonid) {
                info = item[field];
            }
        });
        return info;
    }
    getAllPokemons(): Observable<Pokemon[]> {
        return this.http.get<Pokemon[]>(this.pokemonUrl)
            .pipe(
                tap(_ => this.log('fetched all pokemons')),
                catchError(this.handleError('getAllPokemons', []))
            );
    }
}
