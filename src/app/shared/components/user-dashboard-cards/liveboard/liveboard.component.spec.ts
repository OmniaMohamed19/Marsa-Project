import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveboardComponent } from './liveboard.component';

describe('LiveboardComponent', () => {
  let component: LiveboardComponent;
  let fixture: ComponentFixture<LiveboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiveboardComponent]
    });
    fixture = TestBed.createComponent(LiveboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
