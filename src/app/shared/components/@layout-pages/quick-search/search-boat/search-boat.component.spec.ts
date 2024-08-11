import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBoatComponent } from './search-boat.component';

describe('SearchBoatComponent', () => {
  let component: SearchBoatComponent;
  let fixture: ComponentFixture<SearchBoatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchBoatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBoatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
