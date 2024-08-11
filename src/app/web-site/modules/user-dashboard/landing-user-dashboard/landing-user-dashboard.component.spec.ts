import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingUserDashboardComponent } from './landing-user-dashboard.component';

describe('LandingUserDashboardComponent', () => {
  let component: LandingUserDashboardComponent;
  let fixture: ComponentFixture<LandingUserDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingUserDashboardComponent]
    });
    fixture = TestBed.createComponent(LandingUserDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
