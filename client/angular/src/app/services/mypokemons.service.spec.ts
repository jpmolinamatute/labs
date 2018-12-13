import { TestBed } from '@angular/core/testing';

import { MypokemonsService } from './mypokemons.service';

describe('MypokemonsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MypokemonsService = TestBed.get(MypokemonsService);
    expect(service).toBeTruthy();
  });
});
