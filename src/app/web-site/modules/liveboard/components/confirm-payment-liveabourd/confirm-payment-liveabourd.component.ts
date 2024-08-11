import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-confirm-payment-liveabourd',
  templateUrl: './confirm-payment-liveabourd.component.html',
  styleUrls: ['./confirm-payment-liveabourd.component.scss']
})
export class ConfirmPaymentLiveabourdComponent {
  tripId:any;
  confirmRequest: any;
  relatedtrips: any[] = [];
  showRelated : boolean = false;
  constructor(
    private _httpService: HttpService,
    private route: ActivatedRoute,
  )
  {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      const res = JSON.parse(params['res']);
      this.confirmRequest = res;
      this.tripId = params['trip_id'];

      this.getLiveAbourdById(this.tripId)
    })
  }
  getLiveAbourdById(activityID: any) {
    this._httpService
      .get(
        environment.marsa,
        `liveboard/details/` + activityID
      )
      .subscribe((res: any) => {
        if(res?.Relatedtrips) {
          this.showRelated = true;
          this.relatedtrips = res?.Relatedtrips;
        }

      });
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay:true,
    margin:10,
    navSpeed: 700,
    navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
    responsive: {
      0: {
        items: 1
      },
      740: {
        items: 4
      },
      940: {
        items: 4
      },
      1200: {
        items: 4
      }
    },
    nav: true
  }
}
