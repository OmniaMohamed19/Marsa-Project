import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingUsComponent } from './booking-us.component';

describe('BookingUsComponent', () => {
  let component: BookingUsComponent;
  let fixture: ComponentFixture<BookingUsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingUsComponent]
    });
    fixture = TestBed.createComponent(BookingUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
