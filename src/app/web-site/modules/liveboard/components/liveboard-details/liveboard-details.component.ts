import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../../../core/services/http/http.service';
import { environment } from '../../../../../../environments/environment.prod';
import { ImageSliderModalComponent } from '../../../../../shared/sliders/image-slider-modal/image-slider-modal.component';
import { BoatSliderModalComponent } from '../../../../../shared/sliders/boat-slider-modal/boat-slider-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../../shared/services/auth.service';
import { MatSelectChange } from '@angular/material/select';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { CabinInfoModalComponent } from '../../../../../shared/sliders/cabin-info-modal/cabin-info-modal.component';
import { FormControl, Validators } from '@angular/forms';
import { HeaderService } from '../../../../../shared/services/header.service';
import { SEOService } from '../../../../../shared/services/seo.service';

@Component({
  selector: 'app-liveboard-details',
  templateUrl: './liveboard-details.component.html',
  styleUrls: ['./liveboard-details.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition(':enter, :leave', [animate(300)]),
    ]),
  ],
})
export class LiveboardDetailsComponent {
  @Output() bookNowClicked: EventEmitter<void> = new EventEmitter<void>();
  persons: number = 1;
  liveabourdID: any;
  activeTabId: string | null = null;
  liveabourdData: any;
  relatedtrips: any = [];
  flattenedCabin: any = [];
  showRelatedtrip: boolean = false;
  selectedStar: number = 0;
  starNumber: any;
  comment: any;
  availableOptionMap!: SafeHtml;
  Why_chosse_us: any;
  cover: string = '';
  images: any;
  coverAndImages: any;
  happyGustImages: any[] = [];
  remainingImages: string[] = [];
  showSeeMore: boolean = false;
  videoBoatUrl!: SafeHtml;
  videoUrl!: SafeHtml;
  isLogin: boolean = false;
  hideMobileFooter = false;
  showAllReviews: boolean = false;
  @ViewChild('videoModal') videoModal!: TemplateRef<any>;
  @ViewChild('videoBoatModal') videoBoatModal!: TemplateRef<any>;
  @ViewChild('selectCabinButton') selectCabinButton!: ElementRef;
  showMapFrame: boolean = false;
  googleIframe!: SafeHtml;
  selectedSchedule: any;
  selectedDateControl: FormControl<string | null> = new FormControl<
    string | null
  >('', Validators.required);
  isSingleImage: boolean = false;
  isMobile = false;
  isTestDivScrolledIntoView: any;
  showScrollToTopButton: boolean = false;
  schedules_id:any;
  desplayedGustImages: any[] = [];
  displayBasic: boolean = false;
  displayBoats: boolean = false;
  displayCustom: boolean =false;
  activeIndex: number = 0;
  boatImages: any[] = [];
  constructor(
    private el: ElementRef,
    private _httpService: HttpService,
    private sanitizer: DomSanitizer,
    public translate: TranslateService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private _AuthService: AuthService,
    private cdr: ChangeDetectorRef,
    private _Router: Router,
    private headerService: HeaderService,
    private seoService: SEOService
  ) {
    if (window.screen.width < 768) {
      this.isMobile = true;
    }
  }

  @HostListener('document:scroll', ['$event'])
  isScrolledIntoView() {
    if (this.selectCabinButton) {
      const rect = this.selectCabinButton.nativeElement.getBoundingClientRect();
      const topShown = rect.top >= 0;
      const bottomShown = rect.bottom <= window.innerHeight;
      this.isTestDivScrolledIntoView = topShown && bottomShown;
      if (this.isTestDivScrolledIntoView) {
        this.hideMobileFooter = true;
      } else {
        this.hideMobileFooter = false;
      }
    }
  }
  
  responsiveOptions: any[] | undefined;
  imageClick(index: number) {
    console.log(this.happyGustImages);
    this.desplayedGustImages = Array.from(
      Object.entries(this.happyGustImages)
    ).map(([key, value]) => ({ value }));
    console.log(this.desplayedGustImages);
    console.log(index);
    
    this.activeIndex = index;
    this.displayCustom = true;
}

  ngOnInit(): void {
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 6
    },
    {
      breakpoint: '1200px',
      numVisible: 6
  },
      {
          breakpoint: '1024px',
          numVisible: 6
      },
      {
          breakpoint: '768px',
          numVisible: 5
      },
      {
          breakpoint: '560px',
          numVisible: 3
      }
  ];
    this.activatedRoute.params.subscribe((params: any) => {
      this.liveabourdID = params.id;
      this.loadData();
      this.getAbout();
    });
    this._AuthService.$isAuthenticated.subscribe((isAuth: any) => {
      this.isLogin = isAuth;
    });
  }

  loadData(): void {
    this.getActivityById(this.liveabourdID);
  }

  getRoundedRate(rate: number | null): number {
    if (rate !== null && !isNaN(Number(rate))) {
      return parseFloat(Number(rate).toFixed(1));
    } else {
      return 0;
    }
  }

  getRatingDescription(rate: number): string {
    if (rate >= 3 && rate < 4) {
      return 'Good';
    } else if (rate >= 4 && rate < 5) {
      return 'Very Good';
    } else if (rate === 5) {
      return 'Excellent';
    } else {
      return '';
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
      const options = {
          root: null, // viewport
          rootMargin: '0px',
          threshold: 1.5, // element should be at least 70% visible
      };
  
      const observer = new IntersectionObserver((entries) => {
          const visibleEntries = entries.filter(entry => entry.isIntersecting);
  console.log(visibleEntries);
  
          if (visibleEntries.length > 0) {
              // Set activeTabId to the id of the first visible element
              this.activeTabId = visibleEntries[0].target.id;
          }
      }, options);
  
      const tabs = document.querySelectorAll('.tab-pane');
      tabs.forEach((tab) => {
          observer.observe(tab);
      });
  }

  scrollTo(tabId: string) {
    this.activeTabId = tabId;
    const tabElement = document.getElementById(tabId);

    if (tabElement) {
      const elementRect = tabElement.getBoundingClientRect();
      const offset = window.scrollY + elementRect.top - 170; // Calculate position 50px above the element

      window.scrollTo({
        top: offset,
        behavior: 'smooth',
      });
    }
  }

  scrollToselectCabinButton() {
    this.bookNow();
    // this.selectCabinButton.nativeElement.scrollIntoView({
    //   behavior: 'smooth',
    //   block: 'start',
    // });
  }

  scrollToCabin() {
    this.selectCabinButton.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  getOverviewItems(overview: string): string[] {
    return overview.split('\n');
  }
  getActivityById(liveabourdID: any) {
    this._httpService
      .get(environment.marsa, `liveboard/details/` + liveabourdID)
      .subscribe((res: any) => {
        this.liveabourdData = res?.tripDetails;
        this.googleIframe = this.sanitizer.bypassSecurityTrustHtml(
          this.liveabourdData.PlaceOnMap
        );
        this.availableOptionMap = this.sanitizer.bypassSecurityTrustHtml(
          this.liveabourdData.Map
        );
        this.images = res?.tripDetails?.Images;
        this.cover = res?.tripDetails?.Cover;
        this.coverAndImages = [...this.images, this.cover];
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          res?.tripDetails?.Video
        );
        this.happyGustImages = this.liveabourdData?.HappyGust;
        console.log(this.liveabourdData);
        console.log(this.liveabourdData?.Terms);
        
        this.remainingImages = this.liveabourdData?.HappyGust.slice(1);
        const boat = this.liveabourdData?.Boats.find(
          (boat: any) => boat.id === liveabourdID
        );
        this.videoBoatUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          boat?.video
        );
        if (res?.realatedtrip) {
          this.relatedtrips = res?.realatedtrip?.data;
          this.showRelatedtrip = true;
          console.log(this.relatedtrips);
        }
        this.flattenedCabin = this.liveabourdData.cabin.reduce(
          (acc: any[], curr: any[]) => {
            return acc.concat(curr);
          },
          []
        );

        this.isSingleImage = this.images.length === 1;
        this.seoService.updateSEO(
          this.liveabourdData?.MetaTitle,
          this.liveabourdData?.MetaDesc,
          this.liveabourdData?.Seo
        );
      });
  }

  getAbout() {
    this._httpService.get(environment.marsa, 'Aboutus').subscribe({
      next: (response: any) => {
        this.Why_chosse_us = response.Why_chosse_us;
      },
    });
  }

  openVideotrip(): void {
    this.dialog.open(this.videoModal, {
      width: '100%',
      height: '70%',
    });
  }

  openMainImagesModal(): void {
    const dialogRef = this.dialog.open(ImageSliderModalComponent, {
      width: '100%',
    });
    dialogRef.componentInstance.images = Array.from(
      Object.entries(this.liveabourdData.Images)
    ).map(([key, value]) => ({ value }));
  }

  openImageSliderModal(): void {
    // this.showSeeMore = true;
    const dialogRef = this.dialog.open(ImageSliderModalComponent, {
      width: '60%',
    });
    dialogRef.componentInstance.images = this.happyGustImages;
  }

  openBoatSliderModal(boat: any): void {
    this.displayBoats=true
    this.boatImages = Array.from(Object.entries(boat.images)).map(
      ([key, value]) => ({ value })
    );
    // const dialogRef = this.dialog.open(BoatSliderModalComponent, {
    //   width: '100%',
    // });
    console.log(this.coverAndImages);
    
    console.log(this.boatImages);
    // console.log(boat.images);
    
    // dialogRef.componentInstance.images = boatImages;
  }

  openCabinSliderModal(cabin: any): void {
    const boatImages = cabin.images;
    const dialogRef = this.dialog.open(CabinInfoModalComponent, {
      width: '100%',
    });
    dialogRef.componentInstance.images = boatImages;
    dialogRef.componentInstance.data = cabin;
  }

  openVideoBoat(): void {
    this.dialog.open(this.videoBoatModal, {
      width: '100%',
      height: '70%',
    });
  }

  incrementAdult() {
    if (this.persons < this.getValue('Avilabile')) {
      setTimeout(() => {
        this.persons++;
        this.cdr.detectChanges();
      });
    }
  }

  decrementAdult() {
    if (this.persons > 1) {
      setTimeout(() => {
        this.persons--;
        this.cdr.detectChanges();
      });
    }
  }

  getValue(key: any): any {
    if (this.selectedDateControl && this.selectedDateControl.value) {
      return this.selectedDateControl.value[key] || 0;
    }
    return 0;
  }

  onSelectionChange(event: MatSelectChange): void {
    setTimeout(() => {
      this.persons = 1;
    });
  }

  onValueChange(event: any) {
    console.log(event.id);
    this.selectedSchedule = event.id;
  }

  showMap(): void {
    this.showMapFrame = !this.showMapFrame;
  }

  onStarHover(starNumber: number) {
    this.selectedStar = starNumber;
  }

  onStarClick(starNumber: number) {
    this.starNumber = starNumber;
  }
  hasId(value: any): value is { id: string } {
    return typeof value === 'object' && 'id' in value;
  }
  bookNow() {
    if (this.selectedDateControl.invalid) {
      this.selectedDateControl.markAsTouched();
      return;
    } else {
      if (!this.isLogin) {
        window.scroll(0, 0);
        this.toastr.info('Please login first ', '', {
          disableTimeOut: false,
          titleClass: 'toastr_title',
          messageClass: 'toastr_message',
          timeOut: 1500,
          closeButton: true,
        });

        this.headerService.toggleDropdown();
      } else {
        if (this.hasId(this.selectedDateControl.value)) {
          this.schedules_id = this.selectedDateControl.value.id;
        }
        const model = {
          trip_id: this.liveabourdData.id,
          class: 'collective',
          adult: this.persons,
          // schedules_id: this.selectedDateControl.value,
          schedules_id: this.schedules_id,
        };
        // let x=this.selectedDateControl.value
        // console.log(this.schedules_id);
        

        this._httpService
          .post(environment.marsa, 'liveboard/cabin/price', model)
          .subscribe({
            next: (res: any) => {
              const queryParams = {
                res: JSON.stringify(res),
                trip_id: this.liveabourdData.id,
                class: 'collective',
                adult: this.persons,
                schedules_id: this.schedules_id,
              };
              this._Router.navigate(
                [
                  '/',
                  this.translate.currentLang,
                  'liveboard',
                  'liveboard-payment',
                ],
                { queryParams }
              );
            },
          });
      }
    }
  }
  addtoFavorits(btn: any,event:any) {
    if (btn.classList.contains('bg-primary')) {
      
      } else {
        // Add to favorites/wishlist
        this._httpService
        .post(environment.marsa,'Wishlist/add', { trip_id: this.liveabourdData?.id })
        .subscribe({
          next: (res: any) => {
            console.log(res);
            btn.classList.add('bg-primary');
            event.target.classList.add('text-white');
            event.target.classList.remove('text-dark');
          }
        });
    }
  }
  addReview(): void {
    const model = {
      trip_id: this.liveabourdData?.id,
      rating: this.starNumber,
      comment: this.comment,
    };
    if (!this.isLogin) {
      this.toastr.info('Please login first', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
      window.scroll(0, 0);
      this.headerService.toggleDropdown();
    } else {
      this._httpService
        .post(environment.marsa, 'Review/addreview', model)
        .subscribe({
          next: (res: any) => {
            this.toastr.success(res.message, '', {
              disableTimeOut: false,
              titleClass: 'toastr_title',
              messageClass: 'toastr_message',
              timeOut: 5000,
              closeButton: true,
            });
            this.loadData();
            this.starNumber = 0;
            this.comment = '';
            this.selectedStar = 0;
          },
        });
    }
  }

  calculateSlideWidth(): string {
    if (this.images.length < 6) {
      return `${100 / this.images.length}%`;
    } else {
      return '16.66667%'; // Equal width for 6 items
    }
  }

  customOptions: OwlOptions = {
    loop: this.relatedtrips.length > 4 ? true : false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
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

  imagesOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    autoplay: true,
    autoplayTimeout: 3000,
    margin: 0,
    nav: false,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 3,
      },
      720: {
        items: 6,
      },
      1200: {
        items: 6,
      },
    },
  };

  coverAndImagesOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    margin: 0,
    navSpeed: 900,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
      1200: {
        items: 1,
      },
    },
    nav: true,
  };
}
