import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MatchMakerComponent } from './match-maker/match-maker.component';
import { AddPokemonComponent } from './add-pokemon/add-pokemon.component';
import { DomesticatedPokemonComponent } from './domesticated-pokemon/domesticated-pokemon.component';

@NgModule({
    declarations: [
        AppComponent,
        MatchMakerComponent,
        AddPokemonComponent,
        DomesticatedPokemonComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
