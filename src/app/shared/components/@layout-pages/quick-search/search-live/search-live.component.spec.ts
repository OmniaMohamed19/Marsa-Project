import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLiveComponent } from './search-live.component';

describe('SearchLiveComponent', () => {
  let component: SearchLiveComponent;
  let fixture: ComponentFixture<SearchLiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchLiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
