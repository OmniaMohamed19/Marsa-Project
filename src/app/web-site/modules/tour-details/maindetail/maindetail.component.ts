import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private httpService: HttpService,
    private translate: TranslateService
  ) {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    this.tourid = localStorage.getItem('destinationId');
    this.httpService
      .get(environment.marsa, 'place/details/' + this.tourid)
      .subscribe((res) => {
        console.log("placeDetails" + res);
        this.placeDetails = res;
        console.log("placeDetails" + this.placeDetails);

        this.AllActivities = this.placeDetails?.alltrips;
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
