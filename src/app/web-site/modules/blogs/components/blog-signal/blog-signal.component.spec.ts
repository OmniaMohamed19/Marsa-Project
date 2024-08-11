import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogSignalComponent } from './blog-signal.component';

describe('BlogSignalComponent', () => {
  let component: BlogSignalComponent;
  let fixture: ComponentFixture<BlogSignalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlogSignalComponent]
    });
    fixture = TestBed.createComponent(BlogSignalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
