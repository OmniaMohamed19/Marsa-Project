import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinInfoModalComponent } from './cabin-info-modal.component';

describe('CabinInfoModalComponent', () => {
  let component: CabinInfoModalComponent;
  let fixture: ComponentFixture<CabinInfoModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CabinInfoModalComponent]
    });
    fixture = TestBed.createComponent(CabinInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
