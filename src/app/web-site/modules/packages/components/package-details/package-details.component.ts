import {
  Component,
  ElementRef,
  HostListener,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../../../core/services/http/http.service';
import { AuthService } from '../../../../../shared/services/auth.service';
import { HeaderService } from '../../../../../shared/services/header.service';
import { ImageSliderModalComponent } from '../../../../../shared/sliders/image-slider-modal/image-slider-modal.component';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../../environments/environment.prod';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { PackageSliderModalComponent } from '../../../../../shared/sliders/package-slider-modal/package-slider-modal.component';
import {
  MatDatepicker,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import { FormControl, Validators } from '@angular/forms';
import { SEOService } from '../../../../../shared/services/seo.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {
  CUSTOM_DATE_FORMATS,
  CustomDateAdapter,
} from 'src/app/shared/components/Date/custom-date-adapter';
@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.scss'],
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
export class PackageDetailsComponent {
  @ViewChild('videoModal') videoModal!: TemplateRef<any>;
  @ViewChild('checkAvailabilityButton') checkAvailabilityButton!: ElementRef;

  rows: any;
  packageID: any;
  relatedtrips: any[] = [];
  Why_chosse_us: any;
  isLogin = false;
  activeTabId: string | null = null;
  happyGuestImages: any[] = [];
  remainingImages: string[] = [];
  selectedStar = 0;
  starNumber: any;
  comment: any;
  adults: number = 1;
  children: number = 0;
  infant: number = 0;
  showAllReviews = false;
  // duration: any;
  @ViewChild('startPicker') startPicker!: MatDatepicker<Date>;
  @ViewChild('endPicker') endPicker!: MatDatepicker<Date>;

  minDate = new Date(); // Today's date
  maxDate: Date | null = null; // Maximum selectable date
  duration: string = '10 Day'; // Placeholder for API response
  startDate: any;
  endDate: Date | null = null;
  formattedStartDate: any;
  formattedEndDate: any;

  // Define selectedDateControl as a FormControl
  selectedDateControl = new FormControl('', Validators.required);

  constructor(
    public translate: TranslateService,
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private el: ElementRef,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private authService: AuthService,
    private headerService: HeaderService,
    private router: Router,
    private seoService: SEOService
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const fromTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    const tabs = this.el.nativeElement.querySelectorAll('.tab-pane');
    tabs.forEach((tab: any) => {
      const tabTop = tab.offsetTop;
      const tabBottom = tabTop + tab.offsetHeight;
      if (fromTop >= tabTop && fromTop < tabBottom) {
        this.activeTabId = tab.id;
      }
    });
  }

  scrollTo(tabId: string) {
    const tabElement = document.getElementById(tabId);
    if (tabElement) {
      tabElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.packageID = params.id;
      this.loadData();
      this.getAbout();
    });
    this.authService.$isAuthenticated.subscribe((isAuth: any) => {
      this.isLogin = isAuth;
    });
  }

  loadData(): void {
    this.getActivityById(this.packageID);
  }

  getActivityById(packageID: any) {
    this.httpService
      .get(environment.marsa, `package/details/` + packageID)
      .subscribe((res: any) => {
        this.rows = res?.tripDetails;
        this.duration = this.rows.duration;
        this.seoService.updateSEO(
          this.rows.MetaTitle,
          this.rows.MetaDesc,
          this.rows.Seo
        );
        this.duration = res?.tripDetails.duration;
        this.calculateEndDate();
      });
  }

  calculateEndDate() {
    if (!this.startDate || !this.duration) {
      return;
    }
    const durationInDays = parseInt(this.duration.split(' ')[0], 10);
    const endDate = new Date(this.startDate);
    endDate.setDate(endDate.getDate() + durationInDays);
    this.endDate = endDate;
    const formattedEndDate = this.datePipe.transform(
      this.endDate,
      'yyyy/MM/dd'
    );
    this.formattedEndDate = formattedEndDate;
  }

  onStartDateChange(event: MatDatepickerInputEvent<Date>) {
    this.startDate = event.value;
    this.calculateEndDate();
    console.log('this.startDate', this.startDate);
    if (this.startDate) {
      this.selectedDateControl.setValue(this.startDate);
      const formattedStartDate = this.datePipe.transform(
        this.startDate,
        'yyyy/MM/dd'
      );
      this.formattedStartDate = formattedStartDate;
    } else {
      this.selectedDateControl.setValue(null);
    }
    this.selectedDateControl.markAsTouched();
  }

  dateFilter = (date: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date ? date >= today : false;
  };

  getAbout() {
    this.httpService.get(environment.marsa, 'Aboutus').subscribe({
      next: (response: any) => {
        this.Why_chosse_us = response.Why_chosse_us;
      },
    });
  }

  // Increment the number of adults
  incrementAdult() {
    if (this.adults < this.getMaxValue('adultsMax')) {
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
    if (this.children < this.getMaxValue('childrenMax')) {
      this.children++;
    }
  }

  decrementChildren() {
    if (this.children > 0) {
      this.children--;
    }
  }

  incrementInfant() {
    if (this.infant < this.getMaxValue('infantsMax')) {
      this.infant++;
    }
  }

  decrementInfant() {
    if (this.infant > 0) {
      this.infant--;
    }
  }

  getMaxValue(category: string): number {
    if (this.rows && this.rows.Price) {
      switch (category) {
        case 'adultsMax':
          return this.rows.Price.AdultMax;
        case 'childrenMax':
          return this.rows.Price.childernMax; // Note the typo in "children"
        case 'infantsMax':
          return this.rows.Price.infantMax;
        default:
          return 0;
      }
    }
    return 0; // Return default value if rows or Price is not available
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

  onStarHover(starNumber: number) {
    this.selectedStar = starNumber;
  }

  onStarClick(starNumber: number) {
    this.starNumber = starNumber;
  }

  openImageSliderModal(): void {
    const dialogRef = this.dialog.open(ImageSliderModalComponent, {
      width: '60%',
    });
    dialogRef.componentInstance.images = this.happyGuestImages;
  }

  addReview(): void {
    const model = {
      package_id: this.rows?.id,
      rating: this.starNumber,
      comment: this.comment,
      trip_id: 0,
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
      this.httpService
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

  checkPrice() {
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
        const model = {
          packege_id: this.packageID,
          adult: this.adults,
          childern: this.children,
          infant: this.infant,
        };

        this.httpService
          .post(environment.marsa, 'package/price', model)
          .subscribe({
            next: (res: any) => {
              const queryParams = {
                res: JSON.stringify(res),
                packege_id: this.packageID,
                adult: this.adults,
                childern: this.children,
                infant: this.infant,
                booking_date: this.formattedStartDate,
                end_date: this.formattedEndDate,
              };
              this.router.navigate(
                ['/', this.translate.currentLang, 'packages', 'packagePayment'],
                { queryParams }
              );
            },
          });
      }
    }
  }

  openPackModal(packageId: number) {
    // const selectedPackage = this.rows.find((pkg: any) => pkg.id === packageId);
    const dialogRef = this.dialog.open(PackageSliderModalComponent, {
      width: '60%',
    });
    dialogRef.componentInstance.packages = this.rows.PackageTrips;
  }
}
