import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss'],
})
export class TrendingComponent {
  @Input() showHeading: boolean = true;
  @Input() placeId: any;
  @Input() applyMargin: boolean = true;
  route = '/' + this.translate.currentLang + '/tours/details/';
  responsiveOptions: any[] | undefined;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    autoplay: true,
    margin: 49,
    navSpeed: 700,
    // navText: [
    //   "<i class='fa fa-angle-left'></i>",
    //   "<i class='fa fa-angle-right'></i>",
    // ],
    responsive: {
      0: {
        items: 1,
      },
      740: {
        items: 2,
      },
      940: {
        items: 3,
      },
      1200: {
        items: 4,
      },
      2000: {
        items: 4,
      },
    },
  };
  AllTrend: any;
  activeNowTrend: any = [];
  isMobile = false;
  @ViewChild('listmobile1', { static: true }) listmobile:
    | ElementRef
    | undefined;
  @ViewChild('tours1', { static: true }) tours: ElementRef | undefined;
  @ViewChild('liveboard1', { static: true }) liveaboard: ElementRef | undefined;
  @ViewChild('transfer1', { static: true }) transfer: ElementRef | undefined;
  @ViewChild('boat1', { static: true }) boat: ElementRef | undefined;
  constructor(
    private httpService: HttpService,
    private translate: TranslateService
  ) {
    if (window.screen.width < 1024) {
      this.isMobile = true;
    }


    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  ngOnChanges() {
    if (this.placeId) {
      console.log(this.placeId);
      this.activeNowTrend = this.AllTrend?.['Tours&Activities']?.filter(
        (item: any) => {
          console.log(item.place);

          if (item.place == this.placeId) {
            return item;
          }
        }
      );
      console.log(this.AllTrend);
    }
  }

  ngOnInit(): void {
    this.httpService.get(environment.marsa, 'triend').subscribe((res: any) => {
      this.AllTrend = res;
      this.activeNowTrend = res['Tours&Activities'];
    });
  }

  setActiveTrend(key: any) {
    this.activeNowTrend = this.AllTrend[key];
    this.scrollToActive(key);
  }

  scrollToActive(value: any) {
    let activeElement: any;
    if (value == 'Tours&Activities') {
      activeElement = this.tours!.nativeElement;
    } else if (value == 'Liveaboard') {
      console.log(this.listmobile);
      activeElement = this.liveaboard!.nativeElement;
    } else if (value == 'Boats') {
      activeElement = this.boat!.nativeElement;
    } else {
      activeElement = this.transfer!.nativeElement;
    }
    // if (value != 'tour') {
    const containerElement = this.listmobile!.nativeElement;
    const activeElementLeft = activeElement.offsetLeft;
    const activeElementWidth = activeElement.offsetWidth;
    const containerScrollLeft = containerElement.scrollLeft;
    const containerWidth = containerElement.clientWidth;

    const activeElementRight = activeElementLeft + activeElementWidth;
    const containerRightEdge = containerScrollLeft + containerWidth;
    if (activeElementLeft < containerScrollLeft) {
      containerElement.scrollLeft = activeElementLeft - 200;
    } else if (activeElementRight > containerRightEdge) {
      containerElement.scrollLeft = activeElementRight - containerWidth + 200;
    }

    switch (value) {
      case 'Tours&Activities':
        this.route = '/' + this.translate.currentLang + '/tours/details/';
        break;
      case 'Liveaboard':
        this.route =
          '/' + this.translate.currentLang + '/liveboard/liveboardDetails/';
        break;
      case 'Boats':
        this.route = '/' + this.translate.currentLang + '/boats/details/';
        break;
      case 'Transfer':
        this.route = '/' + this.translate.currentLang + '/boats/details/';
        break;
    }
  }
}
