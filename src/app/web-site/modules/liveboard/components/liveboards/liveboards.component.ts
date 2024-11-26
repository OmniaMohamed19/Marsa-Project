import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-liveboards',
  templateUrl: './liveboards.component.html',
  styleUrls: ['./liveboards.component.scss'],
})
export class LiveboardsComponent implements OnInit {
  rows: any = [];
  search: any;
  types: any;
  destination: any = [];
  place_id: any = null;
  TypeTrip: any = null;
  start_d: any = null;
  minDate: string;
  rate: any = null;
  min_price = 0;
  min_priceChoosen: any = null;
  max_priceChoosen: any = null;
  max_price = 400;
  isMobile = false;
  showFilter = true;
  minSelected: number = this.min_price; // To store selected min price
  maxSelected: number = this.max_price; // To store selected max price

  onSliderInput(event: any): void {
    // Retrieve the current values from the event
    this.minSelected = event.value[0]; // Assuming you're using a range slider
    this.maxSelected = event.value[1];

    // Call your functions with the current values
    this.setMinPrice(this.minSelected);
    this.setMaxPrice(this.maxSelected);
  }
  constructor(
    private httpservices: HttpService,
    private route: ActivatedRoute
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

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params);
      if (params.place_id || params.date) {
        this.place_id = params['place_id'];
        this.start_d = params['date'];
        this.filter();
      } else {
        this.getAllLiveboard();
      }
    });
  }
  displaySelectedType: string = 'All'; // النص المعروض في الخيار الافتراضي

  getAllLiveboard() {
    this.httpservices.get(environment.marsa, 'liveboard').subscribe({
      next: (response: any) => {
        console.log(response);
        this.rows = response.trips;
        this.rows.data = this.rows.data.filter(
          (trip: any) => Object.keys(trip.Schedule).length > 0
        );

        this.search = response.search;
        this.types = response.types;
        if (this.destination?.length == 0) {
          this.getPlace();
        }
      },
    });
  }

  getPlace() {
    this.httpservices.get('marsa', 'place').subscribe({
      next: (res: any) => {
        this.destination = res.places;
      },
    });
  }
  searchDestination(ev: any) {
    this.place_id = ev.target.value;
    this.filter();
  }

  searchByType(ev: any) {
    if (!ev.target.value) {
      this.httpservices.get(environment.marsa, 'liveboard').subscribe({
        next: (response: any) => {
          console.log(response);
          this.rows = response.trips;
          this.rows.data = this.rows.data.filter(
            (trip: any) => Object.keys(trip.Schedule).length > 0
          );
          console.log(this.rows);

          this.search = response.search;
          this.types = response.types;
          if (this.destination?.length == 0) {
            this.getPlace();
          }
        },
      });
    }
    this.TypeTrip = ev.target.value;
    this.place_id = 'null';
    this.start_d = null;
    this.rate = null;
    this.min_priceChoosen = null;
    this.max_priceChoosen = null;

    this.filter();
  }

  filterByDate(ev: any) {
    this.start_d = ev.target.value;
    this.filter();
  }

  filter() {
    this.httpservices
      .post(environment.marsa, 'liveboard/filter', {
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
      })
      .subscribe((response: any) => {
        console.log(response);

        this.rows = response.trips;
        // this.rows = response.trips;
        this.rows.data =this.rows.data.filter((trip:any) => Object.keys(trip.Schedule).length > 0);
        if (this.types?.length == 0) {
          console.log('Set tyoes');
          this.types = response.types;
          this.search = response.search;
        }
        if (this.destination?.length == 0) {
          console.log('Set place');
          this.getPlace();
        }
      });
  }

  setMinPrice(event: any) {
    // console.log(event);
    this.min_priceChoosen = event.target.value;
    this.filter();
  }
  setMaxPrice(event: any) {
    // console.log(event);
    this.max_priceChoosen = event.target.value;
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
}
