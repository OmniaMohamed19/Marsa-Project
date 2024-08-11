import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginInfoComponent } from './login-info.component';

describe('LoginInfoComponent', () => {
  let component: LoginInfoComponent;
  let fixture: ComponentFixture<LoginInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginInfoComponent]
    });
    fixture = TestBed.createComponent(LoginInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
