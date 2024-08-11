import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeSignComponent } from './code-sign.component';

describe('CodeSignComponent', () => {
  let component: CodeSignComponent;
  let fixture: ComponentFixture<CodeSignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CodeSignComponent]
    });
    fixture = TestBed.createComponent(CodeSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
