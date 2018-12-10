import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


import { environment } from '../environments/environment';
import { MessageService } from './message.service';
import { PokemonType } from './type';
@Injectable({
    providedIn: 'root'
})
export class TypelistService {
    private pokemonUrl = `${environment.myEndpoint}/api/typelist`;  // URL to web api
    constructor(private http: HttpClient, private messageService: MessageService) { }
    private log(message: string) {
        this.messageService.add(`TypelistService: ${message}`);
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
    getPokemonTypes(): Observable<PokemonType[]> {
        return this.http.get<PokemonType[]>(this.pokemonUrl)
            .pipe(
                tap(_ => this.log('fetched pokemon type')),
                catchError(this.handleError('getPokemonTypes', []))
            );
    }
}
