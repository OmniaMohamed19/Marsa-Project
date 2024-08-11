import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageEditComponent } from './package-edit.component';

describe('PackageEditComponent', () => {
  let component: PackageEditComponent;
  let fixture: ComponentFixture<PackageEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackageEditComponent]
    });
    fixture = TestBed.createComponent(PackageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
