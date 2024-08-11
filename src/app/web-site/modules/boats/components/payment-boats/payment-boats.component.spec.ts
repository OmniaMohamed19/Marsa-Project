import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentBoatsComponent } from './payment-boats.component';

describe('PaymentBoatsComponent', () => {
  let component: PaymentBoatsComponent;
  let fixture: ComponentFixture<PaymentBoatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentBoatsComponent]
    });
    fixture = TestBed.createComponent(PaymentBoatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
