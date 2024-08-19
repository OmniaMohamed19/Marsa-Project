import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    center: false,
    dots: true,
    margin:60,
    // autoplay: true,
    navSpeed: 700,
    // navText: [],
    responsive: {
      0: {
        items: 1,
        margin:20,
      },
      740: {
        items: 1,
        margin:20,
      },
      940: {
        items: 3,
        margin:20,
      },
      1200: {
        items: 3
      }
    },
    nav: false
  }
  data: any;
  constructor( private _HttpService: HttpService,
    public translate: TranslateService)
{}
  ngOnInit(): void {
    this._HttpService.get(environment.marsa, 'Aboutus').subscribe({
      next: (response: any) => {
        console.log(response);
        this.data = response;
       // this.rev=this.data.review;
       // console.log(this.rev);

      },
    });
  }
  onImgError(event: any) {
    event.target.src = 'assets/custom/user-dasboard/user.jpeg';
  }
}
