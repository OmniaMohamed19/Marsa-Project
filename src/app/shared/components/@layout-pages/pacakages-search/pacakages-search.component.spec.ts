import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacakagesSearchComponent } from './pacakages-search.component';

describe('PacakagesSearchComponent', () => {
  let component: PacakagesSearchComponent;
  let fixture: ComponentFixture<PacakagesSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PacakagesSearchComponent]
    });
    fixture = TestBed.createComponent(PacakagesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
