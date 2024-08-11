import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

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
  rate: any = null;
  min_price = 0;
  min_priceChoosen: any = null;
  max_priceChoosen: any = null;
  max_price = 400;
  showFilter = true;
  isMobile = false;
  constructor(
    private _httpsService: HttpService,
    private route: ActivatedRoute
  ) {
    if (window.screen.width < 1024) {
      this.isMobile = true;
      this.showFilter = false;
    }
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params);
      if (params.place_id || params.date) {
        this.place_id = params['place_id'];
        this.start_d = params['date'];
        this.filter();
      } else {
        this.getAllactivity();
      }
    });
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
  getPlaces() {
    this._httpsService.get('marsa', 'place').subscribe({
      next: (res: any) => {
        this.destination = res.places;
      },
    });
  }
  setMinPrice(event: any) {
    console.log(event);
    this.min_priceChoosen = event.target.value;
    this.filter();
  }
  setMaxPrice(event: any) {
    console.log(event);
    this.max_priceChoosen = event.target.value;
    this.filter();
  }

  filterDuration(ev: any) {
    console.log(ev);
    if (ev == 'all') {
      this.FilterDurationid = [];
    } else {
      this.FilterDurationid = [];
      this.FilterDurationid.push(ev);
    }
    this.filter();
  }

  filterTime(ev: any) {
    console.log(ev);
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
