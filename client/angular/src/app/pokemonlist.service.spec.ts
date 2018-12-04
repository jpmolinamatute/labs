import { TestBed } from '@angular/core/testing';

import { PokemonlistService } from './pokemonlist.service';

describe('PokemonlistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PokemonlistService = TestBed.get(PokemonlistService);
    expect(service).toBeTruthy();
  });
});
