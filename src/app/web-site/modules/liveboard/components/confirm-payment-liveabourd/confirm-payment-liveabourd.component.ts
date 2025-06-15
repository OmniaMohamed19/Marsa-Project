import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MapModalComponent } from 'src/app/shared/components/@layout-pages/map-modal/map-modal.component';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-confirm-payment-liveabourd',
  templateUrl: './confirm-payment-liveabourd.component.html',
  styleUrls: ['./confirm-payment-liveabourd.component.scss'],
})
export class ConfirmPaymentLiveabourdComponent {
  tripId: any;
  confirmRequest: any;
  relatedtrips: any[] = [];
  showRelated: boolean = false;
  Bookingid: any;
  mapModalOptions: any = {
    headerTitle: 'location',
    modalname: 'mapModalDeatails',
  };
  BookingInfo: any;
  locationValue = '';
  latitudeValue: any;
  longitudeValue: any;
  showServices: boolean = true;
  customerForm!: FormGroup;
  userData: any = {};
  @ViewChild('btn') btn: ElementRef | undefined;
  constructor(
    private _httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private _AuthService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private titleService: Title
  ) {}
  ngOnInit(): void {
    this.titleService.setTitle('Confirm Booking');

    this.initForm();
    this.route.queryParams.subscribe((params: any) => {
      const res = JSON.parse(params['res']);
      this.confirmRequest = res;
      this.tripId = params['trip_id'];
      this.Bookingid = res.Bookingid;
      this.getLiveAbourdById(this.tripId);
    });
    if (this.confirmRequest) {
      this.Bookingid = this.confirmRequest?.Bookingid;
      this.userData.name = this.confirmRequest?.name || '';
      this.userData.phone = this.confirmRequest?.Phone || '';
      this.userData.email = this.confirmRequest?.['E-mail'] || '';
      console.log(this.userData);
    }
    this.customerForm.patchValue(this.userData);
    this.customerForm
      ?.get('phone')
      ?.patchValue(this.userData.phone.replace(/[()]/g, ''));
  }
  getLiveAbourdById(activityID: any) {
    this._httpService
      .get(environment.marsa, `liveboard/details/` + activityID)
      .subscribe((res: any) => {
        if (res?.realatedtrip.data) {
          this.showRelated = true;
          this.relatedtrips = res?.realatedtrip.data;
        }
      });
  }
  onCountryChange(event: any) {
    console.log(event);
    console.log(this.customerForm.value);
    let x =
      '+' +
      event.dialCode +
      this.customerForm.value.phone.nationalNumber?.replace('-', '');
    this.customerForm?.get('phone')?.patchValue(x);
    console.log(x);
  }
  ReturnToPayment() {
    if (typeof window !== 'undefined') {
      const storedQueryParams = localStorage.getItem('queryParamsliveaboard');
      if (storedQueryParams) {
        const queryParams = JSON.parse(storedQueryParams);

        queryParams.Bookingid = this.Bookingid;
        queryParams.BookingInfo = this.confirmRequest;
        localStorage.setItem(
          'queryParamsliveaboard',
          JSON.stringify(queryParams)
        );

        // Now you can access the properties of queryParams
        localStorage['editLiveaboard'] = true;
        this.router.navigate(
          ['/', this.translate.currentLang, 'liveboard', 'liveboard-payment'],
          { queryParams }
        );
      }
    }
  }
  initForm() {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      note: [''],
      pickup_point: ['', this.showServices ? [Validators.required] : []],
      locationValue: [''],
      // locationValue: [''],
    });
  }
  confirmEdit() {
    if (this.showServices) {
      this.customerForm
        .get('pickup_point')
        ?.setValidators([Validators.required]);
    } else {
      this.customerForm.get('pickup_point')?.clearValidators();
      this.customerForm.get('pickup_point')?.updateValueAndValidity();
    }
    if (this.customerForm.valid) {
      let phoneNumber = this.customerForm.get('phone')?.value['number'];
      let code = this.customerForm.get('phone')?.value['dialCode'];

      const model = {
        code: code,
        userid: this.userData?.id,

        ...this.customerForm.value,
        phone: phoneNumber.replace('+', ''),
        lng: this.longitudeValue ? this.longitudeValue.toString() : '',
        lat: this.latitudeValue ? this.latitudeValue.toString() : '',
        note: '',
      };

      Object.keys(model).forEach(
        (k) => (model[k] == '' || model[k]?.length == 0) && delete model[k]
      );
      console.log(this.BookingInfo);

      this._httpService
        .post(environment.marsa, 'bookinfo/' + this.Bookingid, model)
        .subscribe({
          next: (res: any) => {
            Swal.fire(
              'Your Booking has been send successfully.',
              'The Liveaboard official will contact you as soon as possible. For Future communication, please reach out to info@marsawaves.com',
              'success'
            );
            this.btn?.nativeElement.click();
            this.confirmRequest = res.booking_information;
          },
          error: (err: any) => {
            Swal.fire(
              'Booking Failed',
              'An error occurred while processing your booking. Please try again later.',
              'error'
            ).then(() => {});
          },
        });
    } else {
      // Mark all form controls as touched to trigger validation messages
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
      this.latitudeValue = result.latitude;
      this.longitudeValue = result.longitude;
      this.locationValue = `(${result.longitude} - ${result.latitude})`;
    });
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
}
