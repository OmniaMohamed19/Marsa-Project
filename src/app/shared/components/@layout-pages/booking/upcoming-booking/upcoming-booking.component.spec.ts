import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingBookingComponent } from './upcoming-booking.component';

describe('UpcomingBookingComponent', () => {
  let component: UpcomingBookingComponent;
  let fixture: ComponentFixture<UpcomingBookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpcomingBookingComponent]
    });
    fixture = TestBed.createComponent(UpcomingBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
