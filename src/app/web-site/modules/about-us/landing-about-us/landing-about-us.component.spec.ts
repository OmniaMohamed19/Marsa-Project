import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingAboutUsComponent } from './landing-about-us.component';

describe('LandingAboutUsComponent', () => {
  let component: LandingAboutUsComponent;
  let fixture: ComponentFixture<LandingAboutUsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingAboutUsComponent]
    });
    fixture = TestBed.createComponent(LandingAboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
