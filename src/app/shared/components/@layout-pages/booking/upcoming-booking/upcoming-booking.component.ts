import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MapModalComponent } from '../../map-modal/map-modal.component';
@Component({
  selector: 'app-upcoming-booking',
  templateUrl: './upcoming-booking.component.html',
  styleUrls: ['./upcoming-booking.component.scss'],
})
export class UpcomingBookingComponent {

  tabs: any = [];
  other = '';
  reasons: any = [
    { id: 1, label: 'The trip too expensive.' },
    { id: 2, label: 'I Try the platform' },
    { id: 3, label: 'My vacation has been postpond' },
    { id: 4, label: 'Other' },
  ];
  @ViewChild('btn') btn: ElementRef | undefined;
  choosenReason: any;
  upcoming: any = [];
  allUpcoming: any = [];
  activeSection = 'all'; // Initialize with a default value
  activeBooking: any;
  customerForm!: FormGroup;
  locationValue = '';
  latitudeValue: any;
  longitudeValue: any;
  showServices: boolean = true;
  userData: any;
  booking_date: any;
  datePipe: any;
  tripId: any;
  mapModalOptions: any = {
    headerTitle: 'location',
    modalname: 'mapModalDeatails',
  };
  Bookingid: any;
  constructor(
    private httpService: HttpService,
    private _AuthService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}
  setActiveSection(section: string) {
    this.upcoming = [];
    this.activeSection = section;
    console.log(this.activeSection);
    if (this.activeSection == 'all') {
      this.upcoming = this.allUpcoming;
    } else {
      this.upcoming = this.allUpcoming.filter((item: any) => {
        if (item.categoryid == this.activeSection) {
          return item;
        }
      });
      console.log(this.upcoming);
    }
  }

  setReason(reason: any) {
    console.log(reason);
    this.choosenReason = reason;
  }

  ngOnInit() {
    this.initForm();

    this.httpService.get(environment.marsa, 'profile').subscribe((res: any) => {
      this.tabs = res?.triptypes;
      // console.log(this.tabs);
      this.tabs[0].category = 'Activities';
      this.tabs[1].category = 'Liveaboard';
      this.tabs[2].category = 'Private Boats';

      // console.log(this.tabs);

      this.upcoming = res?.userDashboard?.upcomming;

      console.log(res);
      this.allUpcoming = this.upcoming;
    });
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
  }
  initForm() {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      note: [''],
      pickup_point: ['', this.showServices ? [Validators.required] : []],
      locationValue: ['', ],
      // locationValue: [''],
    });
  }
  setBookingId(arg0: any) {
    this.Bookingid=arg0
  }
  setActiveBooking(bookingId: any) {
    this.activeBooking = bookingId;
  }

  cancelBooking() {
    console.log(this.activeBooking);
    this.httpService
      .post(environment.marsa, 'user/book/cancel', {
        id: this.activeBooking,
        reason:
          this.choosenReason.id !== 4 ? this.choosenReason.label : this.other,
      })
      .pipe(
        catchError((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text:
              err.error || 'An unexpected error occurred, please try again.',
            confirmButtonText: 'Ok',
          });
          return of(null);
        }),
        finalize(() => {})
      )
      .subscribe((res: any) => {
        if (res) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Your tour has been cancelled successfully!',
            confirmButtonText: 'Ok',
          });
        }
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
      // const parts = this.booking_date.split('/');
      // const formattedDate = new Date(
      //   parseInt(parts[2]),
      //   parseInt(parts[1]) - 1,
      //   parseInt(parts[0])
      // );

      // // Format the date using DatePipe
      // const formattedDateString = this.datePipe.transform(
      //   formattedDate,
      //   'yyyy/MM/dd'
      // );
      let phoneNumber = this.customerForm.get('phone')?.value['number'];
      let code = this.customerForm.get('phone')?.value['dialCode'];

      const model = {
        code: code,
        // trip_id: this.tripId,
        userid: this.userData?.id,
        // avilable_option_id: this.avilable_option_id,
        // class: this.class,
        // adult: this.adult,
        // childern: this.childern,
        // infant: this.infant,
        // booking_date: formattedDateString,
        // payment_method: this.payment_method ? this.payment_method : 'cash',
        // coupon_id: this.Coupons ? this.Coupons[0]?.id : '',
        ...this.customerForm.value,
        phone: phoneNumber.replace('+', ''),
        lng: this.longitudeValue ? this.longitudeValue.toString() : '',
        lat: this.latitudeValue ? this.latitudeValue.toString() : '',
        // booking_time: this.time,
        // cardholder_name: this.cardholderName,
        // cvv: this.cvv,
        // expiry_year: this.expirYear,
        // expiry_month: this.expiryMonth?Number(this.expiryMonth):null,
        // card_number: this.cardNumber,
        // booking_option: this.activityData?.bookingOption.reduce(
        //   (acc: any[], item: any, index: number) => {
        //     if (this.checkboxStatus[index]) {
        //       acc.push({
        //         id: item.id,
        //         persons: this.personsInputValues[index] || 0,
        //       });
        //     }
        //     return acc;
        //   },
        //   []
        // ),
      };
      // if (model.booking_option.length == 0) {
      //   model.booking_option = null;
      // }
      Object.keys(model).forEach(
        (k) => (model[k] == '' || model[k]?.length == 0) && delete model[k]
      );
      console.log(model);
      this.httpService
        .post(environment.marsa, 'bookinfo/' + this.Bookingid, model)
        .subscribe({
          next: (res: any) => {
            console.log(res);
            // this.getTripById(this.tripId);

            // if (res && res.link) {
            //   window.location.href = res.link;
            // } else {
            //   const queryParams = {
            //     res: JSON.stringify(res),
            //     trip_id: this.tripId,
            //   };
            //   this.router.navigate(
            //     ['/', this.translate.currentLang, 'tours', 'confirm'],
            //     { queryParams }
            //   );

            Swal.fire(
              'Your request has been send successfully.',
              'The Boat official will contact you as soon as possible to communicate with us , please send us at info@marsawaves.com',
              'success'
            );
            this.btn?.nativeElement.click()

            // localStorage.removeItem('editTour');
            // localStorage.removeItem('queryParams');
            // this.router.navigate(['/', this.translate.currentLang])
            // }
          },
          error: (err: any) => {
            // localStorage.removeItem('editTour');
            // localStorage.removeItem('queryParams');
            console.log('Error during booking:', err.message);
            Swal.fire(
              'Booking Failed',
              'An error occurred while processing your booking. Please try again later.',
              'error'
            ).then(() => {
              // this.goBack();
            });
          },
        });
    } else {

      console.log(this.customerForm);

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
        console.log(result);
        this.latitudeValue = result.latitude;
        this.longitudeValue = result.longitude;
        this.locationValue = `(${result.longitude} - ${result.latitude})`;
      });
    }
}
