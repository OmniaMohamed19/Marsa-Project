import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-package-confirm',
  templateUrl: './package-confirm.component.html',
  styleUrls: ['./package-confirm.component.scss']
})
export class PackageConfirmComponent {
  packege_id: any;
  confirmRequest: any;
  relatedtrips: any[] = [];
  Bookingid: any;

  constructor(
    private _httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
  ) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      const res = JSON.parse(params['res']);
      this.confirmRequest = res;
      this.packege_id = params['packege_id'];
      this.Bookingid = res.Bookingid;

      this.getTripById(this.packege_id)
    })
  }
  getTripById(activityID: any) {
    this._httpService
      .get(
        environment.marsa,
        `package/details/` + activityID
      )
      .subscribe((res: any) => {
        this.relatedtrips = res.Relatedtrips;

      });
  }

  ReturnToPayment(){
    if (typeof window !== 'undefined') {

      const storedQueryParams = localStorage.getItem('queryParamsPackages');
      if (storedQueryParams) {
          const queryParams = JSON.parse(storedQueryParams);
          queryParams.Bookingid = this.Bookingid;
          queryParams.BookingInfo = this.confirmRequest;
          // Now you can access the properties of queryParams
          localStorage['editPackage']=true
          localStorage.setItem('queryParamsPackages', JSON.stringify(queryParams));
          this.router.navigate(
            ['/', this.translate.currentLang, 'packages', 'packagePayment'],
            { queryParams }
          );
      }
    }
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
