import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-payment-table',
  templateUrl: './payment-table.component.html',
  styleUrls: ['./payment-table.component.scss'],
})
export class PaymentTableComponent {
  activeTab: string = '6months';
  @Input() billings: any;
  setFilter(interval: string) {
    // Implement your logic to filter the table based on the selected interval
    this.activeTab = interval;
  }
}
