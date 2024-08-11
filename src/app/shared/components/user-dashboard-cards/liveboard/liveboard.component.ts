import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-liveboard',
  templateUrl: './liveboard.component.html',
  styleUrls: ['./liveboard.component.scss'],
})
export class LiveboardComponent {
  activeTab: string = 'year';
  @Input() liveaboards: any;
  thisYear: any;
  filterdLiveAboard: any = [];

  ngOnInit() {
    this.filterdLiveAboard = this.liveaboards;
    this.thisYear = new Date().getFullYear();
    console.log(this.thisYear);
  }

  setFilter(interval: string) {
    // Implement your logic to filter the table based on the selected interval
    this.activeTab = interval;
    if (interval == 'year') {
      this.filterdLiveAboard = this.liveaboards?.filter((item: any) => {
        return item.time.substr(0, 4) == this.thisYear.toString();
      });
      console.log(this.filterdLiveAboard);
    } else {
      this.filterdLiveAboard = this.liveaboards?.filter((item: any) => {
        return item.time.substr(0, 4) == interval.toString();
      });
      console.log(this.filterdLiveAboard);
    }
  }
}
