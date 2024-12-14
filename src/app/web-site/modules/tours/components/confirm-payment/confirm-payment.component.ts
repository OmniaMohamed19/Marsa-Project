import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-confirm-payment',
  templateUrl: './confirm-payment.component.html',
  styleUrls: ['./confirm-payment.component.scss'],
})
export class ConfirmPaymentComponent implements OnInit {
  tripId: any;
  Bookingid: any;
  confirmRequest: any;
  relatedtrips: any[] = [];
  tripletails: any;
  constructor(
    private _httpService: HttpService,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      const res = JSON.parse(params['res']);
      this.confirmRequest = res;

      this.tripId = params['trip_id'];
      this.Bookingid = res.Bookingid;
      this.getTripById(this.tripId);
    });
  }
  getTripById(activityID: any) {
    this._httpService
      .get(environment.marsa, `Activtes/details/` + activityID)
      .subscribe((res: any) => {
        this.tripletails = res.tripDetails;
        this.relatedtrips = res.Relatedtrips;
      });
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    margin: 10,
    navSpeed: 700,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      740: {
        items: 4,
      },
      940: {
        items: 4,
      },
      1200: {
        items: 4,
      },
    },
    nav: true,
  };
  ReturnToPayment() {

    if (typeof window !== 'undefined') {
      const storedQueryParams = localStorage.getItem('queryParams');
      if (storedQueryParams) {
        const queryParams = JSON.parse(storedQueryParams);
        queryParams.Bookingid = this.Bookingid;
        queryParams.BookingInfo = this.confirmRequest;
        localStorage['editTour'] = true;
        localStorage.setItem('queryParams', JSON.stringify(queryParams));
        this.router.navigate(
          ['/', this.translate.currentLang, 'tours', 'payment'],
          { queryParams }
        );
      }
    }
  }
}
