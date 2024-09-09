import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-overview-card',
  templateUrl: './overview-card.component.html',
  styleUrls: ['./overview-card.component.scss'],
})
export class OverviewCardComponent {
  @Input() userDetails: any;
  tabs = [
    { label: 'Settings', section: 'section1' },
    // { label: 'Login Information', section: 'section2' },
    // { label: 'Payment Method', section: 'section3' },
    // { label: 'Site Settings', section: 'section4' },
  ];

  activeSection = 'section1'; // Initialize with a default value

  setActiveSection(section: string) {
    this.activeSection = section;
  }
}
