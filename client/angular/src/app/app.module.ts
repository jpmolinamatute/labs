import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MatchMakerComponent } from './match-maker/match-maker.component';
import { AddPokemonComponent } from './add-pokemon/add-pokemon.component';
import { DomesticatedSummaryComponent } from './domesticated-summary/domesticated-summary.component';
import { DomesticatedDetailComponent } from './domesticated-detail/domesticated-detail.component';
import { SingleDomesPokemonComponent } from './single-domes-pokemon/single-domes-pokemon.component';
import { PokemonlistService } from './services/pokemonlist.service';
import { TypelistService } from './services/typelist.service';
import { DisplayDomesticatedComponent } from './display-domesticated/display-domesticated.component';

@NgModule({
    declarations: [
        AppComponent,
        MatchMakerComponent,
        AddPokemonComponent,
        DomesticatedSummaryComponent,
        SingleDomesPokemonComponent,
        DisplayDomesticatedComponent,
        DomesticatedDetailComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [PokemonlistService, TypelistService],
    bootstrap: [AppComponent]
})
export class AppModule { }
