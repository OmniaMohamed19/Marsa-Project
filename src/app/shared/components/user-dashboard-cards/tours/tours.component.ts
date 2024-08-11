import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.scss'],
})
export class ToursComponent {
  @Input() tours: any;
  @Input() types: any;
  activityTypes: any = [];
  filteredTours: any = [];
  activeSection = 'all'; // Initialize with a default value

  ngOnChanges() {
    console.log(this.types);
    this.activityTypes = this.types[0].types;
  }
  setActiveSection(section: string) {
    this.activeSection = section;
    if (this.activeSection != 'all') {
      this.filteredTours = this.tours.data.filter((item: any) => {
        return item.tripTypeid == section;
      });
    }
  }
}
