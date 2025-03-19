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
  thisYear: number = new Date().getFullYear();
  filterdTours: any = [];
 selectedTour : any;
 years: { label: string; value: string }[] = [];
 ngOnChanges(changes: SimpleChanges): void {
   
    if (changes) {
      this.filterdTours=changes['tours']?.currentValue

    }
  }
  generateYears() {
    const currentYear = new Date().getFullYear();
    this.years = [
      { label: 'This Year', value: currentYear.toString() },
      { label: (currentYear - 1).toString(), value: (currentYear - 1).toString() },
      { label: (currentYear - 2).toString(), value: (currentYear - 2).toString() },
      { label: (currentYear - 3).toString(), value: (currentYear - 3).toString() }
    ];
  }


  ngOnInit() {
    this.filterdTours = this.tours;

    this.generateYears();
    this.activeTab = this.thisYear.toString();

  }
  openModal(tour: any) {
    this.selectedTour = tour;

  }



  setFilter(year: string) {
    this.activeTab = year;
    this.filterdTours = this.tours?.filter((item: any) => {
      return item.time.substr(0, 4) === year;
    });
  }
}
