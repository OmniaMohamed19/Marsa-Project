import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageConfirmComponent } from './package-confirm.component';

describe('PackageConfirmComponent', () => {
  let component: PackageConfirmComponent;
  let fixture: ComponentFixture<PackageConfirmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackageConfirmComponent]
    });
    fixture = TestBed.createComponent(PackageConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
