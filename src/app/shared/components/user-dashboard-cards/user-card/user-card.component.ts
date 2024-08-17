import { Component } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent {
  userDetails: any;
  types: any;
  tabs = [
    { label: 'Overview', section: 'section1' },
    { label: 'Activities & Tours', section: 'section2' },
    { label: 'Liveaboards', section: 'section3' },
    { label: 'Packages', section: 'section4' },
    { label: 'Transfers', section: 'transports' },
  ];

  activeSection = 'section1'; // Initialize with a default value

  constructor(private httpService: HttpService) {}
  setActiveSection(section: string) {
    this.activeSection = section;
  }

  ngOnInit() {
    this.httpService.get(environment.marsa, 'profile').subscribe((res: any) => {
      this.userDetails = res?.userDashboard;
       console.log(res);
      this.types = res?.triptypes;
    });
  }
}
