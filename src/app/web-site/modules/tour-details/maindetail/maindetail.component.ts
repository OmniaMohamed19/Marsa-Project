import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
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

   visibleTrips: any[] = [];
   tripsPerRow: number = 3;
   rowsToShow: number = 1;

   selectedTrip: number | null = null;
   selectedTripType: any = null;

   hiddenTrips: any[] = [];
   totalTripsCount: number = 0;

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    autoplay: false,
    margin: 50,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
      1200: {
        items: 5,
      },
      2000: {
        items: 6,
      },
    },
  };

  constructor(
    private rout: ActivatedRoute,
    private router:Router,
    private httpService: HttpService,
    private translate: TranslateService
  ) {
    this.screenWidth = window.innerWidth;
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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
  }
}
