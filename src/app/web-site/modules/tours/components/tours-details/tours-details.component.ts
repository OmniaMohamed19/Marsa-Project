import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  TemplateRef,
  ViewChild,
  
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from '../../../../../core/services/http/http.service';
import { environment } from '../../../../../../environments/environment.prod';
import { ImageSliderModalComponent } from '../../../../../shared/sliders/image-slider-modal/image-slider-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { BoatSliderModalComponent } from '../../../../../shared/sliders/boat-slider-modal/boat-slider-modal.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../../../shared/services/auth.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { HeaderService } from '../../../../../shared/services/header.service';
import { CheckAvailpiltyComponent } from '../check-availpilty/check-availpilty.component';
import { SEOService } from '../../../../../shared/services/seo.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {
  CUSTOM_DATE_FORMATS,
  CustomDateAdapter,
} from 'src/app/shared/components/Date/custom-date-adapter';
@Component({
  selector: 'app-tours-details',
  templateUrl: './tours-details.component.html',
  styleUrls: ['./tours-details.component.scss'],
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
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
})
export class ToursDetailsComponent implements AfterViewInit {
  activityID: any;
  isMobile = false;
  activityData: any;
  relatedtrips: any[] = [];
  showMapFrame: boolean = false;
  googleIframe!: SafeHtml;
  availableOptionMap!: SafeHtml;
  Why_chosse_us: any;
  cover: any;
  images: any[] = [];
  coverAndImages: any[] = [];
  happyGustImages: any[] = [];
  remainingImages: string[] = [];
  showSeeMore: boolean = false;
  videoBoatUrl!: SafeHtml;
  dataCheck: any;
  bookedOptionId: any;
  videoUrl!: SafeHtml;
  selectedImage: string | null = null;
  selectedOption: string = 'Collective';
  @ViewChild('videoModal') videoModal!: TemplateRef<any>;
  @ViewChild('videoBoatModal') videoBoatModal!: TemplateRef<any>;
  @ViewChild('checkAvailabilityButton') checkAvailabilityButton!: ElementRef;
  isTestDivScrolledIntoView: any;
  showAllReviews: boolean = false;
  isLogin: boolean = false;
  activeTabId: string | null = null;
  selectedDateControl = new FormControl('', Validators.required);
  selectedTimeControl = new FormControl('', Validators.required);
  timePickerStep: number = 1;
  availabilityChecked: boolean = false;
  adults: number = 1;
  children: number = 0;
  infant: number = 0;
  isShow = false;
  formattedDate: any;
  selectedTime: any;
  selectedStar: number = 0;
  starNumber: any;
  comment: any;
  isSingleImage: boolean = false;
  showBookingOption = false;
  hideMobileFooter = false;

  constructor(
    private _httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    public translate: TranslateService,
    private el: ElementRef,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private _AuthService: AuthService,
    private headerService: HeaderService,
    private seoService: SEOService
  ) {
    if (window.screen.width < 768) {
      this.isMobile = true;
    }
  }
  @ViewChild('myDiv') myDiv!: ElementRef;

  scrollToTop() {
    this.myDiv.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
  ngAfterViewInit() {
    // Initialize the active tab on load
    this.setupIntersectionObserver();
  }

  scrollTo(tabId: string) {
    this.activeTabId = tabId;
    const tabElement = document.getElementById(tabId);

    if (tabElement) {
      tabElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  private setupIntersectionObserver() {
    const options = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.5 // element should be at least 50% visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeTabId = entry.target.id;
        }
      });
    }, options);

    const tabs = document.querySelectorAll('.tab-pane');
    tabs.forEach(tab => {
      observer.observe(tab);
    });
  }




  @HostListener('window:scroll', ['$event'])
  isScrolledIntoView() {
    if (this.checkAvailabilityButton) {
      const rect =
        this.checkAvailabilityButton.nativeElement.getBoundingClientRect();
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

    // constructor() {}
  ngOnInit(): void {
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 6
    },
    {
      breakpoint: '1200px',
      numVisible: 5
  },
      {
          breakpoint: '1024px',
          numVisible: 4
      },
      {
          breakpoint: '768px',
          numVisible: 3
      },
      {
          breakpoint: '560px',
          numVisible: 1
      }
  ];
    this.activatedRoute.params.subscribe((params: any) => {
      this.activityID = params.id;
      this.loadData();
      this.getAbout();
    });
    this._AuthService.$isAuthenticated.subscribe((isAuth: any) => {
      this.isLogin = isAuth;
    });
  }

  share() {
    window.navigator.share({
      title: this.activityData?.Name,
      url: this.router.url,
    });
  }

  loadData(): void {
    this.getActivityById(this.activityID);
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

  // Increment the number of adults
  incrementAdult() {
    if (this.adults < this.getMaxValue('AdultMax')) {
      this.adults++;
    }
  }

  // Decrement the number of adults
  decrementAdult() {
    if (this.adults > 1) {
      this.adults--;
    }
  }

  incrementChildren() {
    if (this.children < this.getMaxValue('childernMax')) {
      this.children++;
    }
  }

  decrementChildren() {
    if (this.children > 1) {
      this.children--;
    }
  }

  incrementInfant() {
    if (this.infant < this.getMaxValue('infantMax')) {
      this.infant++;
    }
  }

  decrementInfant() {
    if (this.infant > 1) {
      this.infant--;
    }
  }

  toggle(): void {
    this.isShow = !this.isShow;
  }

  scrollToCheckAvailabilityButton() {
    this.checkAvailabilityButton.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  getActivityById(activityID: any) {
    this._httpService
      .get(environment.marsa, `Activtes/details/` + activityID)
      .subscribe((res: any) => {
        this.activityData = res?.tripDetails;
        console.log(res);
        this.googleIframe = this.sanitizer.bypassSecurityTrustHtml(
          this.activityData.PlaceOnMap
        );

        this.availableOptionMap = this.sanitizer.bypassSecurityTrustHtml(
          this.activityData.Map
        );
        this.images = Array.from(Object.entries(res?.tripDetails?.Images)).map(
          ([key, value]) => ({ value })
        );
        this.cover = { value: res?.tripDetails?.Cover };
        this.coverAndImages = [...this.images, this.cover];
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          res?.tripDetails?.Video
        );
        this.relatedtrips = res.Relatedtrips;
        this.happyGustImages = this.activityData?.HappyGust;
        this.remainingImages = this.activityData?.HappyGust.slice(1);
        const boat = this.activityData?.Boats.find(
          (boat: any) => boat.id === activityID
        );

        this.videoBoatUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          boat?.video
        );



        this.isSingleImage = this.images.length === 1;

        this.seoService.updateSEO(
          this.activityData?.MetaTitle,
          this.activityData?.MetaDesc,
          this.activityData?.Seo
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
    dialogRef.componentInstance.images = this.images;
  }

  openImageSliderModal(): void {
    // this.showSeeMore = true;
    const happyGustImages = Array.from(
      Object.entries(this.happyGustImages)
    ).map(([key, value]) => ({ value }));
    const dialogRef = this.dialog.open(ImageSliderModalComponent, {
      width: '100%',
    });
    dialogRef.componentInstance.images = happyGustImages;
  }

  openBoatSliderModal(boat: any): void {
    const boatImages = Array.from(Object.entries(boat.images)).map(
      ([key, value]) => ({ value })
    );
    const dialogRef = this.dialog.open(BoatSliderModalComponent, {
      width: '100%',

    });
    dialogRef.componentInstance.images = boatImages;
  }

  openVideoBoat(): void {
    this.dialog.open(this.videoBoatModal, {
      width: '100%',
      height: '50%',
      
    });
  }

  toggleVisibility(item: any): void {
    item.showAnswer = !item.showAnswer;
  }
  getOverviewItems(overview: string): string[] {
    return overview.split('\n');
  }
  // showMap(): void {
  //   this.showMapFrame = !this.showMapFrame;
  // }

  filterDates = (date: Date | null): boolean => {
    if (!date) {
      return false; // Disable empty date
    }

    const today = new Date(); // Get the current date
    today.setHours(0, 0, 0, 0);

    if (date <= today) {
      return date ? date >= today : false; // Disable past dates
    }

    const dayOfWeek = date.getDay();

    if (this.activityData?.TypeOfRepeat === 'w') {
      const selectedDays = this.activityData.TimeOfRepeat?.split('/').map(
        (day: string) => this.getDayNameToNumber(day)
      );
      return selectedDays.includes(dayOfWeek) && this.isTimeBeforeCutOff(date);
    }

    return this.isTimeBeforeCutOff(date);
  };

  isTimeBeforeCutOff = (date: Date): boolean => {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const cutOffTime = this.activityData.CutOfTime;

    if (this.activityData.TypeOfRepeat === 'd') {
      return date >= new Date() && currentTime < cutOffTime;
    }

    return date >= new Date();
  };

  getDayNameToNumber(day: string): number {
    const dayNameMappings: { [day: string]: number } = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    return dayNameMappings[day];
  }

  getTimeOptions = (): string[] => {
    const start = this.activityData.start;
    const end = this.activityData.end;
    let timeOfRepeat = this.activityData.TimeOfRepeat;

    if (this.activityData.TypeOfRepeat === 'h') {
      timeOfRepeat *= 60; // Convert hours to minutes
    } else if (this.activityData.TypeOfRepeat === 'm') {
      // TimeOfRepeat is already in minutes
      timeOfRepeat = this.activityData.TimeOfRepeat;
    }

    const startTime = new Date(`1970-01-01T${start}`);
    const endTime = new Date(`1970-01-01T${end}`);

    const timeOptions: string[] = [];

    let currentTime = startTime;
    while (currentTime <= endTime) {
      const time = currentTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      timeOptions.push(time);

      currentTime = new Date(currentTime.getTime() + timeOfRepeat * 60 * 1000); // Increment by TimeOfRepeat minutes
    }

    return timeOptions;
  };

  addEvent(event: MatDatepickerInputEvent<Date>): void {
    this.formattedDate = this.datePipe.transform(event.value, 'dd/MM/yyyy');
  }

  onTimeSelection(time: string) {
    this.selectedTime = time;
  }

  addAvailableOptions() {
    if (this.selectedDateControl.invalid) {
      this.selectedDateControl.markAsTouched();
      return;
    }
    this.availabilityChecked = true;
    this.scrollTo('availableOptions');
  }

  bookNow(avilable_option_id: number) {
    if (!this.availabilityChecked) {
      this.toastr.info('Please click on "Check availability" first.');
      // this.scrollToCheckAvailabilityButton();
      return;
    } else {
      this.showBookingOption = !this.showBookingOption;
      this.bookedOptionId = avilable_option_id;
      const model = {
        trip_id: this.activityData.id,
        avilable_option_id: avilable_option_id,
        class: '',
        adult: this.adults,
        childern: this.children,
        infant: this.infant,
      };

      if (this.selectedOption === 'Collective') {
        model.class = 'collective';
      } else if (this.selectedOption === 'Private') {
        model.class = 'privete';
      }
      this._httpService
        .post(environment.marsa, 'Activtes/AvailableOption/price', model)
        .subscribe({
          next: (res: any) => {
            this.dataCheck = {
              res: JSON.stringify(res),
              trip_id: this.activityData.id,
              booking_date: this.formattedDate,
              class: model.class,
              time: this.selectedTime,
              avilable_option_id: avilable_option_id,
              adult: this.adults,
              childern: this.children,
              infant: this.infant,
            };
            // const dialogRef = this.dialog.open(CheckAvailpiltyComponent, {
            //   width: '80%',
            //   data: {
            //     res: JSON.stringify(res),
            //     trip_id: this.activityData.id,
            //     booking_date: this.formattedDate,
            //     class: model.class,
            //     time: this.selectedTime,
            //     avilable_option_id: avilable_option_id,
            //     adult: this.adults,
            //     childern: this.children,
            //     infant: this.infant,
            //   },
            // });
            // dialogRef.afterClosed().subscribe(() => {
            //   window.scroll(0, 0); // Scroll after the dialog is fully closed
            // });
          },
        });
    }
  }

  showImage(img: string) {
    this.coverAndImages = [{ value: img }];
  }

  resetCoverAndImages() {
    this.coverAndImages = [];
  }

  changeOption(option: string) {
    this.selectedOption = option;
  }

  getMaxValue(property: string): number {
    let value = 0;
    if (this.selectedOption === 'Collective') {
      value = this.getMinAdultPrice()?.PriceColective[property] || 0;
    } else if (this.selectedOption === 'Private') {
      value = this.getMinAdultPrice()?.PricePrivte[property] || 0;
    }
    return value;
  }

  getMinAdultPrice(): any {
    if (
      !this.activityData ||
      !this.activityData.AvailableOption ||
      this.activityData.AvailableOption.length === 0
    ) {
      return null;
    }
    const minAdultPrice = Math.min(
      ...this.activityData.AvailableOption.map(
        (option: any) => option.PriceColective?.Adult
      )
    );
    if (!isFinite(minAdultPrice)) {
      return null;
    }
    return this.activityData.AvailableOption.find(
      (option: any) => option.PriceColective?.Adult === minAdultPrice
    );
  }

  onStarHover(starNumber: number) {
    this.selectedStar = starNumber;
  }

  onStarClick(starNumber: number) {
    this.starNumber = starNumber;
  }

  addReview(): void {
    const model = {
      trip_id: this.activityData?.id,
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
            this.toastr.success(res.message);
            this.loadData();
            this.starNumber = 0;
            this.comment = '';
            this.selectedStar = 0;
          },
        });
    }
  }
  addtoFavorits(btn: any,event:any) {
    if (btn.classList.contains('bg-primary')) {
      // Remove from favorites/wishlist
      this._httpService
        .get(environment.marsa, 'Wishlist/delete/'+this.activityData?.id)
        .subscribe({
          next: (res: any) => {
            console.log(res);
            // console.log(event.target);
            btn.classList.remove('bg-primary');
            event.target.classList.add('text-dark');
            event.target.classList.remove('text-white');
          }
        });
      } else {
        // Add to favorites/wishlist
        this._httpService
        .post(environment.marsa,'Wishlist/add', { trip_id: this.activityData?.id })
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
  customOptions: OwlOptions = {
    loop: this.relatedtrips.length > 4 ? true : false,
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
    autoplay: false,
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
