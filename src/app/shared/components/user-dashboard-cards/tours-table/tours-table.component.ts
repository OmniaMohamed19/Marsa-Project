import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tours-table',
  templateUrl: './tours-table.component.html',
  styleUrls: ['./tours-table.component.scss'],
})
export class ToursTableComponent {
  @Input() tours: any;
  activeTab: string = 'year';
  thisYear: any;
  filterdTours: any = [];
  ngOnInit() {
    this.filterdTours = this.tours;
    this.thisYear = new Date().getFullYear();
    console.log(this.thisYear);
  }

  setFilter(interval: string) {
    // Implement your logic to filter the table based on the selected interval
    this.activeTab = interval;
    if (interval == 'year') {
      this.filterdTours = this.tours.filter((item: any) => {
        return item.time.substr(0, 4) == this.thisYear.toString();
      });
      console.log(this.filterdTours);
    } else {
      this.filterdTours = this.tours.filter((item: any) => {
        return item.time.substr(0, 4) == interval.toString();
      });
      console.log(this.filterdTours);
    }
  }
}
