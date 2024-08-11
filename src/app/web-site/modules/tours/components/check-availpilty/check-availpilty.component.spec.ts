import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckAvailpiltyComponent } from './check-availpilty.component';

describe('CheckAvailpiltyComponent', () => {
  let component: CheckAvailpiltyComponent;
  let fixture: ComponentFixture<CheckAvailpiltyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckAvailpiltyComponent]
    });
    fixture = TestBed.createComponent(CheckAvailpiltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
