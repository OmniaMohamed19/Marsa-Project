import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { Meta, Title } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.scss'],
})
export class ToursComponent {
  rows: any = [];
  activeView = 'grid';
  FilterTimeid: any = [];
  FilterDurationid: any = [];

  duration: any = [];
  time: any = [];
  types: any = [];
  destination: any = [];
  place_id: any = null;
  TypeTrip: any = null;
  start_d: any = null;
  minDate: string;
  rate: any = null;
  min_price = 0;
  min_priceChoosen: any = null;
  max_priceChoosen: any = 999;
  max_price = 999;
  showFilter = true;
  isMobile = false;
  constructor(
    private _httpsService: HttpService,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
    private cdr: ChangeDetectorRef
  ) {
    if (window.screen.width < 1024) {
      this.isMobile = true;
      this.showFilter = false;
    }
    const today = new Date();
    const dd: string = String(today.getDate()).padStart(2, '0');
    const mm: string = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy: number = today.getFullYear();
    // Set minDate to today's date
    this.minDate = `${yyyy}-${mm}-${dd}`;
  }
  openCalendar(event: Event) {
    const input = event.target as HTMLInputElement;
    input.showPicker(); // يجبر المتصفح على فتح التقويم
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      // استدعاء القيم من queryParams
      if (params.place_id || params.date) {
        this.place_id = params['place_id'];
        this.start_d = params['date'];
        this.filter();
      } else {
        const storedPlaceId = localStorage.getItem('placeId');
        if (storedPlaceId) {
          localStorage.removeItem('placeId'); // حذف القيم بعد استدعائها مباشرة
          this.searchDestination({ target: { value: storedPlaceId } });
        } else {
          this.getAllactivity();
        }
      }
    });

    this.titleService.setTitle('Tours & Activities');
  }


  getAllactivity() {
    this._httpsService.get(environment.marsa, 'Activtes').subscribe({
      next: (response: any) => {
        this.rows = response;
        this.duration = response.duration;
        this.time = response.time;
        this.types = response.types;

        this.getPlaces();
      },
    });
  }
  onPageChange(event: any) {
    const pageNumber = event.page + 1; // PrimeNG uses 0-based index
    this.loadPageData(pageNumber);
    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  loadPageData(pageNumber: number) {
    const url = `Activtes?page=${pageNumber}`; // Properly constructed URL
    this._httpsService.get(environment.marsa, 'Activtes', { page: pageNumber }).subscribe({
      next: (response: any) => {
        this.rows = response;
        this.duration = response.duration;
        this.time = response.time;
        this.types = response.types;

        this.getPlaces();

        // Trigger change detection manually
        this.cdr.detectChanges();
      },
    });
  }
  selectedTimeId: number | null = null;
  clearSelection() {
    this.TypeTrip = '';
    this.place_id = 'null';
    this.start_d = null;
    this.rate = null;
    this.min_priceChoosen = this.min_price; // Reset to default minimum price
    this.max_priceChoosen = this.max_price; // Reset to default maximum price
    for (let i = 2; i <= 5; i++) {
      if (i != 2) {
        document.getElementById('btn-' + i)?.classList.remove('active-rate');
      } else {
        // this.rate = 2;
        document.getElementById('btn-' + i)?.classList.add('active-rate');
      }
    }
    window.scrollTo(0, 0);

    this.getAllactivity();
  }
  getPlaces() {
    this._httpsService.get('marsa', 'place').subscribe({
      next: (res: any) => {
        this.destination = res.places;
      },
    });
  }
  setMinPrice(event: any) {
    this.min_priceChoosen = event.target.value;
    this.filter();
  }
  setMaxPrice(event: any) {
    this.max_priceChoosen = event.target.value;
    this.filter();
  }

  filterDuration(ev: any) {
    this.selectedTimeId = ev;
    if (ev == 'all') {
      this.FilterDurationid = [];
    } else {
      this.FilterDurationid = [];
      this.FilterDurationid.push(ev);
    }
    this.filter();
  }

  filterTime(ev: any) {
    if (ev == 'all') {
      this.FilterTimeid = [];
    } else {
      this.FilterTimeid = [];
      this.FilterTimeid.push(ev);
    }
    this.filter();
  }

  searchDestination(ev: any) {
    this.place_id = ev.target.value;
    this.filter();
  }

  setRate(number: any) {
    for (let i = 2; i <= 5; i++) {
      if (i != number) {
        document.getElementById('btn-' + i)?.classList.remove('active-rate');
      } else {
        this.rate = number;
        document.getElementById('btn-' + i)?.classList.add('active-rate');
        this.filter();
      }
    }
  }

  filter() {
    this._httpsService
      .post(environment.marsa, 'Activtes/filter', {
        Place_id: this.place_id == 'null' ? null : this.place_id,
        TypeTrip: this.TypeTrip == 'null' ? null : this.TypeTrip,
        start_d: this.start_d,
        rating: this.rate ? 'rating' : null,
        value: this.rate,
        price: this.min_priceChoosen || this.max_priceChoosen ? 'price' : null,
        start: this.min_priceChoosen
          ? this.min_priceChoosen
          : this.min_price.toString(),
        end: this.max_priceChoosen
          ? this.max_priceChoosen
          : this.max_price.toString(),
        filterid: this.FilterDurationid.concat(this.FilterTimeid),
      })
      .subscribe((response: any) => {
        this.rows = response;
        if (this.types?.length == 0) {
          this.duration = response.duration;
          this.time = response.time;
          this.types = response.types;
        }
        if (this.destination?.length == 0) {
          this.getPlaces();
        }
      });
  }

  searchByType(ev: any) {
    this.TypeTrip = ev.target.value;
    this.filter();
  }

  filterByDate(ev: any) {
    this.start_d = ev.target.value;
    this.filter();
  }
}
