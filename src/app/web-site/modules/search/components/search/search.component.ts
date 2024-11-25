import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  id: any;
  placeDetails: any;
  TypeTrip: any = null;
  questions: any = [];
  allTripsFiltered: any = [];
  FilterTimeid: any = [];
  FilterDurationid: any = [];
  AllActivities: any = [];
  selectedSight: any;
  route = '/' + this.translate.currentLang + '/tours/details/';
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    autoplay: false,
    margin: 50,
    navSpeed: 700,
    // navText: [
    //   "<i class='fa fa-angle-left'></i>",
    //   "<i class='fa fa-angle-right'></i>",
    // ],
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
    // nav: true,
  };
  constructor(
    private rout: ActivatedRoute,
    private httpService: HttpService,
    private translate: TranslateService
  ) {}
  ngOnInit() {
    this.rout.queryParams.subscribe((params: any) => {
      console.log(params);
      this.id = params?.id;
      this.httpService
        .get(environment.marsa, 'place/details/' + this.id)
        .subscribe((res) => {
          console.log(res);
          this.placeDetails = res;
          console.log("placeDetails" +this.placeDetails);
          this.AllActivities = this.placeDetails?.alltrips;
          this.allTripsFiltered = this.placeDetails.alltrips.filter(
            (item: any) => {
              console.log(item.place);
              if (item.place == this.placeDetails.places.name) {
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
    });
  }
  getImageName(url: string): string {
    const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
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

  setActiveSight(item: any) {
    this.selectedSight = item;
  }
}
