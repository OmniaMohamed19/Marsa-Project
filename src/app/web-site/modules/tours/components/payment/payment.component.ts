import { Component, ElementRef, ViewChild } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { HttpService } from 'src/app/core/services/http/http.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MapModalComponent } from 'src/app/shared/components/@layout-pages/map-modal/map-modal.component';
import Swal from 'sweetalert2';
import { Code } from '../../context/code.interface';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent {
  selectedNationality: any;
  isConfirmationStepEnabled: boolean = false;
  booking_date: any;
  class: any;
  avilableOptions: any;
  activityData: any;
  tripId: any;
  checkboxChecked: boolean = false;
  checkboxStatus: boolean[] = [];
  avilable_option_id: any;
  personsInputValues: number[] = [];
  adult: any;
  childern: any;
  infant: any;
  responseFromAvailableOption: any;
  time: any;
  userData: any;
  customerForm!: FormGroup;
  payment_method: any;
  activeTab: string = 'pills-one-example2';
  filteredNationalities: Observable<Code[]> | undefined;
  showServices: boolean = true;
  coupon:any;
  Coupons:any;
  Total:any;
  nationalities!: Code[];
  // map
  @ViewChild('mapModalDeatails') mapModalDeatails: ElementRef | undefined;

  locationValue = '';
  latitudeValue: any;
  longitudeValue: any;

  mapModalOptions: any = {
    headerTitle: 'location',
    modalname: 'mapModalDeatails',
  };

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private _httpService: HttpService,
    private toastr: ToastrService,
    private _AuthService: AuthService,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.route.queryParams.subscribe((params: any) => {
      const parsedRes = JSON.parse(params['avilableOptions']);
      const trip_id = params['tripId'];
      this.tripId = trip_id;
      this.avilableOptions = parsedRes;
      this.Total=this.avilableOptions?.TotlaPrice;
      this.booking_date = params['booking_date'];
      this.class = params['class'];
      this.avilable_option_id = params['avilable_option_id'];
      this.time = params['booking_time'];
      this.adult = params['adult'];
      this.childern = params['childern'];
      this.infant = params['infant'];
      this.getDataById(this.tripId);
    });
    this.activityData?.bookingOption.forEach(() =>
      this.checkboxStatus.push(false)
    );
    this._AuthService.getUserData().subscribe(
      (data: any) => {
        this.userData = JSON.parse(data); // Assigning the received object directly
        this.customerForm.patchValue(this.userData);
        this.customerForm?.get('phone')?.patchValue('+' + this.userData.phone);
      },
      (error) => {
        // Handle error if needed
        console.error('Error:', error);
      }
    );

    this.getNationality();
  }
  applycoupon(){
    this._httpService
      .get(environment.marsa, `Coupon`)
      .subscribe((res: any) => {
        console.log(res);
        this.Coupons=res.coupon.filter((item:any) =>  item.code == this.coupon)
        this.Total=this.Total - this.Coupons[0].amount
    console.log(this.Coupons);
  });
    console.log(this.coupon);
    // Coupon
  }
  toggleTab(tabId: string, paymentMethod: string) {
    this.activeTab = tabId;
    this.payment_method = paymentMethod;
  }

  isActiveTab(tabId: string): boolean {
    return this.activeTab === tabId;
  }

  initForm() {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      note: [''],
      pickup_point: [''],
      locationValue: [''],
    });
  }

  getDataById(activityID: any) {
    this._httpService
      .get(environment.marsa, `Activtes/details/` + activityID)
      .subscribe((res: any) => {
        this.activityData = res?.tripDetails;
      });
  }

  goBack() {
    this.location.back();
  }

  toggleCheckbox(event: Event, index: number) {
    this.checkboxStatus[index] = !this.checkboxStatus[index];
    const checkbox = event.target as HTMLInputElement;
    const input = document.getElementById(
      `persons-input-${index}`
    ) as HTMLInputElement;
    if (checkbox.checked) {
      input.classList.add('required');
    } else {
      input.classList.remove('required');
    }
  }

  getAvailableOptionIndexById(id: number): number {
    if (this.activityData && this.activityData.AvailableOption) {
      return this.activityData.AvailableOption.findIndex(
        (option: any) => option.id === id
      );
    }
    return -1;
  }

  isInputRequired(index: number): boolean {
    return this.checkboxChecked && !this.personsInputValues[index];
  }

  goToNextStep(stepper: MatStepper) {
    const missingValues = this.activityData.bookingOption.map(
      (item: any, index: number) =>
        this.checkboxStatus[index] && !this.personsInputValues[index]
    );

    if (missingValues.some((value: any) => value)) {
      this.toastr.info('Please enter how many persons ');
      return;
    }
    stepper.next();
    const model = {
      trip_id: this.tripId,
      avilable_option_id: this.avilable_option_id,
      class: this.class,
      adult: this.adult,
      childern: this.childern,
      infant: this.infant,
      booking_option: this.activityData?.bookingOption.reduce(
        (acc: any[], item: any, index: number) => {
          if (this.checkboxStatus[index]) {
            acc.push({
              id: item.id,
              persons: this.personsInputValues[index] || 0,
            });
          }
          return acc;
        },
        []
      ),
    };
    this._httpService
      .post(environment.marsa, 'Activtes/AvailableOption/price', model)
      .subscribe({
        next: (res: any) => {
          this.responseFromAvailableOption = res;
        },
      });
  }

  goToPayment(stepper: MatStepper) {
    if (this.customerForm.valid) {
      stepper.next();
    } else {
      this.markFormGroupTouched(this.customerForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  goToPreviousStep(stepper: MatStepper) {
    stepper.previous();
  }
  preventStepNavigation(stepper: MatStepper, stepIndex: number) {
    stepper.selectedIndex = stepIndex; // Set the selected index to the current step
  }
  confirmBookingByCard(event: Event) {
    event.preventDefault();

    if (this.customerForm.valid) {
      const parts = this.booking_date.split('/');
      const formattedDate = new Date(
        parseInt(parts[2]),
        parseInt(parts[1]) - 1,
        parseInt(parts[0])
      );

      const formattedDateString = this.datePipe.transform(
        formattedDate,
        'yyyy/MM/dd'
      );
      let phoneNumber = this.customerForm.get('phone')?.value['number'];

      const model = {
        trip_id: this.tripId,
        userid: this.userData?.id,
        avilable_option_id: this.avilable_option_id,
        class: this.class,
        adult: this.adult,
        childern: this.childern,
        infant: this.infant,
        booking_date: formattedDateString,
        payment_method: this.payment_method ? this.payment_method : 'tap',
        coupon_id: this.Coupons ? this.Coupons[0]?.id : '',
        ...this.customerForm.value,
        phone: phoneNumber.replace('+', ''),
        lng: this.longitudeValue ? this.longitudeValue.toString() : '',
        lat: this.latitudeValue ? this.latitudeValue.toString() : '',
        booking_time: this.time,
        booking_option: this.activityData?.bookingOption.reduce(
          (acc: any[], item: any, index: number) => {
            if (this.checkboxStatus[index]) {
              acc.push({
                id: item.id,
                persons: this.personsInputValues[index] || 0,
              });
            }
            return acc;
          },
          []
        ),
      };

      Object.keys(model).forEach(
        (k) => (model[k] == '' || model[k]?.length == 0) && delete model[k]
      );
      console.log(model);

      this._httpService.post(environment.marsa, 'Activtes/book', model).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res && res.link) {
            window.location.href = res.link; 
          } else {
            Swal.fire(
              'Booking Confirmed',
              'Your request has been sent successfully. Please check your email for further instructions.',
              'success'
            );
          }
        },
        error: (err: any) => {
          console.error('Error during booking:', err);
          Swal.fire(
            'Booking Failed',
            'An error occurred while processing your booking. Please try again later.',
            'error'
          );
        }
      });
    } else {
      this.markFormGroupTouched(this.customerForm);
    }
  }

  confirmBooking() {
    if (this.customerForm.valid) {
      const parts = this.booking_date.split('/');
      const formattedDate = new Date(
        parseInt(parts[2]),
        parseInt(parts[1]) - 1,
        parseInt(parts[0])
      );

      // Format the date using DatePipe
      const formattedDateString = this.datePipe.transform(
        formattedDate,
        'yyyy/MM/dd'
      );
      let phoneNumber = this.customerForm.get('phone')?.value['number'];

      const model = {
        trip_id: this.tripId,
        userid: this.userData?.id,
        avilable_option_id: this.avilable_option_id,
        class: this.class,
        adult: this.adult,
        childern: this.childern,
        infant: this.infant,
        booking_date: formattedDateString,
        payment_method: this.payment_method ? this.payment_method : 'cash',
        coupon_id:this.Coupons?this.Coupons[0]?.id:'',
        ...this.customerForm.value,
        phone: phoneNumber.replace('+', ''),
        lng: this.longitudeValue ? this.longitudeValue.toString() : '',
        lat: this.latitudeValue ? this.latitudeValue.toString() : '',
        booking_time: this.time,
        booking_option: this.activityData?.bookingOption.reduce(
          (acc: any[], item: any, index: number) => {
            if (this.checkboxStatus[index]) {
              acc.push({
                id: item.id,
                persons: this.personsInputValues[index] || 0,
              });
            }
            return acc;
          },
          []
        ),
      };
      // if (model.booking_option.length == 0) {
      //   model.booking_option = null;
      // }
      Object.keys(model).forEach(
        (k) => (model[k] == '' || model[k]?.length == 0) && delete model[k]
      );
      console.log(model);

      this._httpService
      .post(environment.marsa, 'Activtes/book', model)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          if (res && res.link) {  // افترض أن الباكند يرسل الرابط في المتغير "link"
            window.location.href = res.link; // إعادة توجيه المستخدم مباشرةً إلى الرابط
          } else {
            const queryParams = {
              res: JSON.stringify(res),
              trip_id: this.tripId,
            };
            this.router.navigate(
              ['/', this.translate.currentLang, 'tours', 'confirm'],
              { queryParams }
            );
            Swal.fire(
              'Your request has been send successfully.',
              'The Tour official will contact you as soon as possible to communicate with us, please send us at info@marsawaves.com',
              'success'
            );
          }
        },
        error: (err: any) => {
          console.error('Error during booking:', err);
          Swal.fire(
            'Booking Failed',
            'An error occurred while processing your booking. Please try again later.',
            'error'
          );
        }
      });

    } else {
      // Mark all form controls as touched to trigger validation messages
      this.markFormGroupTouched(this.customerForm);
    }
  }

  // map
  openMapModal(): void {
    const dialogRef = this.dialog.open(MapModalComponent, {
      width: '100%',
      data: {
        mapModalOptions: this.mapModalOptions,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      this.latitudeValue = result.latitude;
      this.longitudeValue = result.longitude;
      this.locationValue = `(${result.longitude} - ${result.latitude})`;
    });
  }

  closeMapModal() {
    if (this.mapModalDeatails) {
      this.mapModalDeatails.nativeElement.closeModal();
    }
  }

  getNationality() {
    this._httpService.get('marsa', 'countrycode').subscribe({
      next: (nationalities: any) => {
        this.nationalities = nationalities.code;
        if (this.customerForm && this.customerForm.get('nationality')) {
          this.filteredNationalities = this.customerForm
            .get('nationality')
            ?.valueChanges.pipe(
              startWith(''),
              map((value) => this._filterNationalities(value))
            );
        }
      },
    });
  }

  private _filterNationalities(value: any): Code[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : ''; // Convert value to lowercase if it's a string, otherwise use an empty string
    return this.nationalities.filter((nationality) =>
      nationality.name.toLowerCase().includes(filterValue)
    );
  }
}
