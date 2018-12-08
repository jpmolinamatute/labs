import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDomesPokemonComponent } from './single-domes-pokemon.component';

describe('SingleDomesPokemonComponent', () => {
  let component: SingleDomesPokemonComponent;
  let fixture: ComponentFixture<SingleDomesPokemonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleDomesPokemonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleDomesPokemonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
