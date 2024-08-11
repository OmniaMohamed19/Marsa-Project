import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

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
}
