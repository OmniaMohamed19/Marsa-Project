import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
})
export class PaymentMethodComponent {
  @Input() userDetails: any;
  tabs = [
    { label: 'Credit / Depit Card', section: 'section1' },
    // { label: 'Paypal', section: 'section2' },
  ];

  activeSection = 'section1'; // Initialize with a default value

  setActiveSection(section: string) {
    this.activeSection = section;
  }
}
