import { Component } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-upcoming-booking',
  templateUrl: './upcoming-booking.component.html',
  styleUrls: ['./upcoming-booking.component.scss'],
})
export class UpcomingBookingComponent {
  tabs: any = [];
  other = '';
  reasons: any = [
    { id: 1, label: 'The trip too expensive.' },
    { id: 2, label: 'I Try the platform' },
    { id: 3, label: 'My vacation has been postpond' },
    { id: 4, label: 'Other' },
  ];
  choosenReason: any;
  upcoming: any = [];
  allUpcoming: any = [];
  activeSection = 'all'; // Initialize with a default value
  activeBooking: any;
  constructor(private httpService: HttpService) {}
  setActiveSection(section: string) {
    this.upcoming = [];
    this.activeSection = section;
    console.log(this.activeSection);
    if (this.activeSection == 'all') {
      this.upcoming = this.allUpcoming;
    } else {
      this.upcoming = this.allUpcoming.filter((item: any) => {
        if (item.categoryid == this.activeSection) {
          return item;
        }
      });
      console.log(this.upcoming);
    }
  }

  setReason(reason: any) {
    console.log(reason);
    this.choosenReason = reason;
  }

  ngOnInit() {
    this.httpService.get(environment.marsa, 'profile').subscribe((res: any) => {
      this.tabs = res?.triptypes;
      this.upcoming = res?.userDashboard?.upcomming?.data;
      console.log(this.upcoming);
      this.allUpcoming = this.upcoming;
    });
  }

  setActiveBooking(bookingId: any) {
    this.activeBooking = bookingId;
  }

  cancelBooking() {
    console.log(this.activeBooking);
    this.httpService
      .post(environment.marsa, 'user/book/cancel', {
        id: this.activeBooking,
        reason:
          this.choosenReason.id != 4 ? this.choosenReason.label : this.other,
      })
      .subscribe(
        (res: any) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
