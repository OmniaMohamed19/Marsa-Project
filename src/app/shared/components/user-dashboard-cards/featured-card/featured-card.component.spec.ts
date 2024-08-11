import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedCardComponent } from './featured-card.component';

describe('FeaturedCardComponent', () => {
  let component: FeaturedCardComponent;
  let fixture: ComponentFixture<FeaturedCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeaturedCardComponent]
    });
    fixture = TestBed.createComponent(FeaturedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
