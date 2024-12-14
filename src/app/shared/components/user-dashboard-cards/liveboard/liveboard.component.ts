import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ProfileService } from 'src/app/core/services/http/profile-service.service';

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
  selectedLiveAboard : any;
  profiles: any[] = [];
  currentPage: number = 1;
  lastPage: number = 1;
  total: number = 0;


  loadProfiles(page: number): void {
    this.profileService.getProfiles(page).subscribe((data:any) => {

      this.profiles = data.userDashboard.data;


      this.liveaboards = data.userDashboard.liveboardDetails.data; // Ensure this is correct
      this.filterdLiveAboard = this.liveaboards;
      this.currentPage = data.userDashboard.liveboardDetails.current_page;
      this.lastPage = data.userDashboard.liveboardDetails.last_page;
      this.total = data.userDashboard.liveboardDetails.total;
      this.cdr.markForCheck();
    });
  }

  nextPage(): void {
    if (this.currentPage < this.lastPage) {
      this.loadProfiles(this.currentPage + 1);
    }
  }
  openModal(liveAboard: any) {
    this.selectedLiveAboard = liveAboard;

  }

  prevPage(): void {


    if (this.currentPage > 1) {
      this.loadProfiles(this.currentPage - 1);
    }
  }

  constructor(
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef
  ) {}



  ngOnChanges() {
    // this.activityTypes = this.types[0].types;
  }

  ngOnInit() {
    this.loadProfiles(this.currentPage);
    this.filterdLiveAboard = this.liveaboards;
    this.thisYear = new Date().getFullYear();
  }

  setFilter(interval: string) {
    // Implement your logic to filter the table based on the selected interval
    this.activeTab = interval;
    if (interval == 'year') {
      this.filterdLiveAboard = this.liveaboards?.filter((item: any) => {
        return item.time.substr(0, 4) == this.thisYear.toString();
      });
    } else {
      this.filterdLiveAboard = this.liveaboards?.filter((item: any) => {
        return item.time.substr(0, 4) == interval.toString();
      });
    }
  }
}
