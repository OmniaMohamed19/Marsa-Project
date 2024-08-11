import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarDataComponent } from './car-data.component';

describe('CarDataComponent', () => {
  let component: CarDataComponent;
  let fixture: ComponentFixture<CarDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarDataComponent]
    });
    fixture = TestBed.createComponent(CarDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
