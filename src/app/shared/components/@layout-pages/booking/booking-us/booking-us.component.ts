import { Component } from '@angular/core';

@Component({
  selector: 'app-booking-us',
  templateUrl: './booking-us.component.html',
  styleUrls: ['./booking-us.component.scss']
})
export class BookingUsComponent {
  isMobile = false;
  constructor(){
    if (window.screen.width < 992) {
      this.isMobile = true;
    }
}
  carouselOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    margin: 0,
    navSpeed: 900,
    nav: true,
    navText: [
      "<div class='nav-button nav-left'><i class='fas fa-chevron-left'></i></div>",
      "<div class='nav-button nav-right'><i class='fas fa-chevron-right'></i></div>"
    ],
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 3
      }
    }
  };
  // ngOnInit() {
  //   this.isMobile = window.innerWidth < 992; // Adjust based on your mobile breakpoint
  // }

}
