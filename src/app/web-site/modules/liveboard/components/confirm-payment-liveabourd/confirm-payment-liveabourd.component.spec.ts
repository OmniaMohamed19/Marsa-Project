import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPaymentLiveabourdComponent } from './confirm-payment-liveabourd.component';

describe('ConfirmPaymentLiveabourdComponent', () => {
  let component: ConfirmPaymentLiveabourdComponent;
  let fixture: ComponentFixture<ConfirmPaymentLiveabourdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmPaymentLiveabourdComponent]
    });
    fixture = TestBed.createComponent(ConfirmPaymentLiveabourdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
