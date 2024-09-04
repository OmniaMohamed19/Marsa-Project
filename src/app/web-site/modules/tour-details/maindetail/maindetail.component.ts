import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-maindetail',
  templateUrl: './maindetail.component.html',
  styleUrls: ['./maindetail.component.scss']
})
export class MaindetailComponent implements OnInit {
  tourid: any;
  placeDetails: any;
  TypeTrip: any = null;
  questions: any = [];
  allTripsFiltered: any = [];
  FilterTimeid: any = [];
  FilterDurationid: any = [];
  AllActivities: any = [];
  selectedSight: any;
  route = '/' + this.translate.currentLang + '/tours/details/';
  screenWidth: number;
   typetrips:any;
   loading: boolean = false;
   carouselItems: any[] = [];
   visibleTrips: any[] = [];
   tripsPerRow: number = 3;
   rowsToShow: number = 1;

   selectedTrip: number | null = null;
   selectedTripType: any = null;

   hiddenTrips: any[] = [];
   totalTripsCount: number = 0;

   custom: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1

    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3 // Add this line
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2 // Add this line
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1 // Add this line
    }
  ];

  responsiveOptions2 = [
    {
      breakpoint: '1024px',
      numVisible: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];



  constructor(
    private rout: ActivatedRoute,
    private router:Router,
    private httpService: HttpService,
    public translate: TranslateService
  ) {
    this.screenWidth = window.innerWidth;
  }
  isFirstTripSelected(): boolean {
    const firstTripId = this.placeDetails?.typeTrip?.[0]?.id;
    return this.selectedTrip === firstTripId;
  }
  toggleSeeMore(rec: any) {
    rec.seeMore = !rec.seeMore;
  }
  selectTrip(tripId: number): void {
    this.selectedTrip = tripId;
    this.selectedTripType = this.placeDetails?.typeTrip.find((type: { id: number; }) => type.id === tripId);

    if (this.selectedTripType) {
      this.totalTripsCount = this.selectedTripType.trip.length;
      this.visibleTrips = this.selectedTripType.trip.slice(0, this.tripsPerRow);
      this.hiddenTrips = this.selectedTripType.trip.slice(this.tripsPerRow);
    }
  }
  @Input() item: any;


  addtoFavorits(btn: any,event:any) {

    if (btn.classList.contains('bg-primary')) {

      } else {
        // Add to favorites/wishlist
        this.httpService
        .post(environment.marsa,'Wishlist/add', { trip_id: this.item?.id })
        .subscribe({
          next: (res: any) => {
            console.log(res);
            btn.classList.add('bg-primary');
            event.target.classList.add('text-white');
            event.target.classList.remove('text-dark');
          }
        });
    }
  }

  showMore(): void {
    this.loading = true;
    setTimeout(() => {
      const nextTrips = this.hiddenTrips.slice(0, this.tripsPerRow);
      this.visibleTrips = [...this.visibleTrips, ...nextTrips];
      this.hiddenTrips = this.hiddenTrips.slice(this.tripsPerRow);
      this.loading = false;
      if (this.hiddenTrips.length === 0) {
        this.hideShowMoreButton();
      }
    }, 1000);
  }

  hideShowMoreButton(): void {
    this.hiddenTrips = [];
  }

  ngOnInit() {


    this.carouselItems = [
      { title: 'Sight 1', image: '../../../../../assets/images/about-us.png' },
      { title: 'Sight 2', image: '../../../../../assets/images/about-us.png' },
      { title: 'Sight 3', image: '../../../../../assets/images/about-us.png' },
      { title: 'Sight 4', image: '../../../../../assets/images/about-us.png' },
      { title: 'Sight 5', image: '../../../../../assets/images/about-us.png' },
      // Add more items
    ];
    this.tourid = localStorage.getItem('destinationId');
    this.httpService
      .get(environment.marsa, 'place/details/' + this.tourid)
        .subscribe((res:any) => {
         this.placeDetails = res;
        this.typetrips = res.typeTrip;
        if (this.typetrips && this.typetrips.length > 0) {
          // Select the first trip by default
          const firstTrip = this.typetrips[0];
          this.selectTrip(firstTrip.id);

          // Set the first item as active
          this.selectedTrip = firstTrip.id;
          this.selectedTripType = firstTrip;
          this.totalTripsCount = firstTrip.trip.length;
          this.visibleTrips = firstTrip.trip.slice(0, this.tripsPerRow);
          this.hiddenTrips = firstTrip.trip.slice(this.tripsPerRow);
        }

        this.AllActivities = this.placeDetails?.alltrips;
        console.log(this.AllActivities)
        this.allTripsFiltered = this.placeDetails.alltrips.filter(
          (item: any) => {
            console.log(item.place);
            if (item.place === this.placeDetails.places.name) {
              return item;
            }
          }
        );
        console.log(this.allTripsFiltered);
        this.httpService
          .get(environment.marsa, 'faq')
          .subscribe((result: any) => {
            console.log(result);
            this.questions = result.FAQ;
          });
      });

  }
  filterTripType(event: any) {
    this.TypeTrip = event.target.value;
    this.filter();
  }

  filterDuration(ev: any) {
    console.log(ev);
    if (ev.target.value == 'all') {
      this.FilterDurationid = [];
    } else {
      this.FilterDurationid = [];
      this.FilterDurationid.push(ev.target.value);
    }
    this.filter();
  }

  filterTime(ev: any) {
    console.log(ev.target.value);
    if (ev.target.value == 'all') {
      this.FilterTimeid = [];
    } else {
      this.FilterTimeid = [];
      this.FilterTimeid.push(ev.target.value);
    }
    this.filter();
  }

  filter() {
    this.httpService
      .post(environment.marsa, 'Activtes/filter', {
        Place_id: this.placeDetails.placesid,
        TypeTrip: this.TypeTrip == 'null' ? null : this.TypeTrip,
        filterid: this.FilterDurationid.concat(this.FilterTimeid),
      })
      .subscribe((response: any) => {
        this.AllActivities = response.trips?.data;
      });
  }

  onImgError(event: any) {
    event.target.src =
      '../../../../../../assets/images/sharm-elnaga-beach 1.png';
    //Do other stuff with the event.target
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
  }
  setActiveSight(item: any) {
    this.selectedSight = item;
  }
  getRoundedRate(rate: number | null): number {
    if (rate !== null && !isNaN(Number(rate))) {
      return parseFloat(Number(rate).toFixed(1));
    } else {
      return 0;
    }
  }
}
