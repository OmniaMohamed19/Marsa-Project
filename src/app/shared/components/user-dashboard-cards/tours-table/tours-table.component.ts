import { Component, Input , OnChanges, SimpleChanges} from '@angular/core';
import { log } from 'console';

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
 selectedTour : any;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.filterdTours=changes['tours']?.currentValue

    }
  }

  ngOnInit() {
    this.filterdTours = this.tours;

    this.thisYear = new Date().getFullYear();

  }
  openModal(tour: any) {
    this.selectedTour = tour;

  }

  setFilter(interval: string) {
    this.activeTab = interval;
    if (interval == 'year') {
      this.filterdTours = this.tours.filter((item: any) => {
        return item.time.substr(0, 4) == this.thisYear.toString();
      });
    } else {
      this.filterdTours = this.tours.filter((item: any) => {
        return item.time.substr(0, 4) == interval.toString();
      });
    }
  }
}
