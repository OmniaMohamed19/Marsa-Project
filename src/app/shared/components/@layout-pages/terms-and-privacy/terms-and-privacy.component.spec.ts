import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndPrivacyComponent } from './terms-and-privacy.component';

describe('TermsAndPrivacyComponent', () => {
  let component: TermsAndPrivacyComponent;
  let fixture: ComponentFixture<TermsAndPrivacyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermsAndPrivacyComponent]
    });
    fixture = TestBed.createComponent(TermsAndPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
