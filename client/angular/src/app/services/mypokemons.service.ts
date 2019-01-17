import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { MyPokemon } from '../classes/mypokemon';
import { environment } from '../../environments/environment';
import { MessageService } from './message.service';
import { ServiceStatus } from '../classes/serviceStatus';


const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': environment.myEndpoint
    })
};


@Injectable({
    providedIn: 'root'
})
export class MypokemonsService {
    private readonly baseURL = `${environment.myEndpoint}/api/mypokemons`;  // URL to web api
    constructor(private http: HttpClient, private messageService: MessageService) { }
    private log(message: string) {
        this.messageService.add(`MypokemonsService: ${message}`);
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

    addPokemon(pokemon: MyPokemon): Observable<any> {
        return this.http.post<any>(this.baseURL, pokemon, httpOptions).pipe(
            tap((pokemonTapId) => this.log(`pokemon added w/ id=${pokemonTapId}`)),
            catchError(this.handleError<any>('addPokemon', 'FAILED'))
        );
    }
    getDomesticatedPokemons(sort: string): Observable<MyPokemon[]> {
        let params: HttpParams;
        let httpOpt = {};
        if (typeof sort === 'string' && sort.length > 0) {
            params = new HttpParams().set('sort', sort);
            httpOpt = { params };
        }

        return this.http.get<MyPokemon[]>(this.baseURL, httpOpt)
            .pipe(
                tap(_ => this.log('fetched my pokemons')),
                catchError(this.handleError('getAllPokemons', []))
            );
    }
    removePokemon(_id: string): Observable<any> {
        const opt = {
            params: new HttpParams().set('_id', _id),
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': environment.myEndpoint
            })
        };

        return this.http.delete<ServiceStatus>(this.baseURL, opt).pipe(
            tap((response) => this.log(`pokemon deleted w/ _id=${_id}`)),
            catchError(this.handleError<ServiceStatus>('addPokemon', { status: 'failed' }))
        );
    }
}
