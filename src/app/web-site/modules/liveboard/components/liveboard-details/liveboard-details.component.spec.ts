import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveboardDetailsComponent } from './liveboard-details.component';

describe('LiveboardDetailsComponent', () => {
  let component: LiveboardDetailsComponent;
  let fixture: ComponentFixture<LiveboardDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiveboardDetailsComponent]
    });
    fixture = TestBed.createComponent(LiveboardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
