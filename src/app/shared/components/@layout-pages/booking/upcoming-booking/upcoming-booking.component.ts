import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';

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
    private fb: FormBuilder,private titleService: Title
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
    this.titleService.setTitle('Upcoming Booking');
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
    
      let phoneNumber = this.customerForm.get('phone')?.value['number'];
      let code = this.customerForm.get('phone')?.value['dialCode'];

      const model = {
        code: code,
        userid: this.userData?.id,

        ...this.customerForm.value,
        phone: phoneNumber.replace('+', ''),
        lng: this.longitudeValue ? this.longitudeValue.toString() : '',
        lat: this.latitudeValue ? this.latitudeValue.toString() : '',

      };

      Object.keys(model).forEach(
        (k) => (model[k] == '' || model[k]?.length == 0) && delete model[k]
      );
      console.log(model);
      this.httpService
        .post(environment.marsa, 'bookinfo/' + this.Bookingid, model)
        .subscribe({
          next: (res: any) => {
            console.log(res);

            Swal.fire(
              'Your request has been send successfully.',
              'The Boat official will contact you as soon as possible to communicate with us , please send us at info@marsawaves.com',
              'success'
            );
            this.btn?.nativeElement.click()


          },
          error: (err: any) => {

            console.log('Error during booking:', err.message);
            Swal.fire(
              'Booking Failed',
              'An error occurred while processing your booking. Please try again later.',
              'error'
            ).then(() => {
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
