import { Component } from '@angular/core';

@Component({
  selector: 'app-transports',
  templateUrl: './transports.component.html',
  styleUrls: ['./transports.component.scss']
})
export class TransportsComponent {
  booking:any[] = [];

  activeTab: string = 'year';

  setFilter(interval: string) {
    // Implement your logic to filter the table based on the selected interval
    console.log('Filtering table by:', interval);
    this.activeTab = interval;
  }
}
