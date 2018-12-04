import { TestBed } from '@angular/core/testing';

import { TypelistService } from './typelist.service';

describe('TypelistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TypelistService = TestBed.get(TypelistService);
    expect(service).toBeTruthy();
  });
});
