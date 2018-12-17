import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomesticatedDetailComponent } from './domesticated-detail.component';

describe('DetailDomesticatedComponent', () => {
    let component: DomesticatedDetailComponent;
    let fixture: ComponentFixture<DomesticatedDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DomesticatedDetailComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DomesticatedDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
