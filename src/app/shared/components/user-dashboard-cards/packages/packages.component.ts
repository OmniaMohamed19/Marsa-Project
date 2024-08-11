import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss'],
})
export class PackagesComponent {
  @Input() packages: any;
  activeTab: string = 'year';

  thisYear: any;
  filterdPackages: any = [];

  ngOnInit() {
    this.filterdPackages = this.packages;
    this.thisYear = new Date().getFullYear();
    console.log(this.thisYear);
  }

  setFilter(interval: string) {
    // Implement your logic to filter the table based on the selected interval
    this.activeTab = interval;
    if (interval == 'year') {
      this.filterdPackages = this.packages?.filter((item: any) => {
        return item.time.substr(0, 4) == this.thisYear.toString();
      });
      console.log(this.filterdPackages);
    } else {
      this.filterdPackages = this.packages?.filter((item: any) => {
        return item.time.substr(0, 4) == interval.toString();
      });
      console.log(this.filterdPackages);
    }
  }
}
