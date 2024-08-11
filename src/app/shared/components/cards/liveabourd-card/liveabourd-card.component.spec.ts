import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveabourdCardComponent } from './liveabourd-card.component';

describe('LiveabourdCardComponent', () => {
  let component: LiveabourdCardComponent;
  let fixture: ComponentFixture<LiveabourdCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiveabourdCardComponent]
    });
    fixture = TestBed.createComponent(LiveabourdCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
