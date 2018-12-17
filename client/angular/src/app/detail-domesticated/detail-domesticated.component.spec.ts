import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDomesticatedComponent } from './detail-domesticated.component';

describe('DetailDomesticatedComponent', () => {
  let component: DetailDomesticatedComponent;
  let fixture: ComponentFixture<DetailDomesticatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailDomesticatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDomesticatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
