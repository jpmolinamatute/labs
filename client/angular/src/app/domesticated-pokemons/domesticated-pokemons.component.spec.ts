import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomesticatedPokemonComponent } from './domesticated-pokemon.component';

describe('DomesticatedPokemonComponent', () => {
  let component: DomesticatedPokemonComponent;
  let fixture: ComponentFixture<DomesticatedPokemonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomesticatedPokemonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomesticatedPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
