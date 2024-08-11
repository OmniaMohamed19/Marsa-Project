import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-featured-slider',
  templateUrl: './featured-slider.component.html',
  styleUrls: ['./featured-slider.component.scss']
})
export class FeaturedSliderComponent {
  
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    autoplay:true,
    margin:30,
    // autoplay:true,
    navText: [
      "<div class='prev-button'><i class='fa-solid fa-angle-right'></i></div>",
      "<div class='next-button'><i class='fa-solid fa-angle-left'></i></div>",
    ],
    responsive: {
      0: {
        items: 1,
        nav: false,
      },
      740: {
        items: 3,
        nav: false,
      },
      940: {
        items: 3,
        nav: false,
      },
      1200: {
        items: 4
      }
    },
    nav: true
  }
}
