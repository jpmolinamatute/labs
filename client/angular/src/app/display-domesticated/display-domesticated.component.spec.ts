import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayDomesticatedComponent } from './display-domesticated.component';

describe('DisplayDomesticatedComponent', () => {
  let component: DisplayDomesticatedComponent;
  let fixture: ComponentFixture<DisplayDomesticatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayDomesticatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayDomesticatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
