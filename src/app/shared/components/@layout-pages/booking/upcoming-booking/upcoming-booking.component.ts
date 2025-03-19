import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileService } from 'src/app/core/services/http/profile-service.service';
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
  Cancelreason:any;
  upcoming: any = [];
  Transferupcoming:any=[];
  upcomingTrips:any=[];
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
  currentPage: number = 1;
  lastPage: number = 1;
  total: number = 0;
  mapModalOptions: any = {
    headerTitle: 'location',
    modalname: 'mapModalDeatails',
  };
  BookingInfo: any;
  constructor(
        private cdr: ChangeDetectorRef,

    private profileService: ProfileService,

    private httpService: HttpService,
    private _AuthService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder,private titleService: Title
  ) {}
  setActiveSection(section: string) {
    this.upcomingTrips = [];
    this.activeSection = section;
    if (this.activeSection == 'all') {
      this.upcomingTrips = this.allUpcoming;
    } else {
      this.upcomingTrips = this.allUpcoming.filter((item: any) => {
        console.log(this.upcomingTrips);
        if (item.categoryid == this.activeSection) {
          console.log(item.categoryid);
          return item;
        }

      });
    }
  }

  // setReason(reason: any) {
  //   this.choosenReason = reason;
  // }

  ngOnInit() {
    this.titleService.setTitle('Upcoming Booking');
    this.initForm();

    this.httpService.get(environment.marsa, 'profile').subscribe((res: any) => {
    this.tabs = res?.triptypes;
    console.log(this.tabs)
     this.tabs[0].category = 'Activities';
    this.tabs[1].category = 'Liveaboard';
    this.tabs[2].category = null;
    this.tabs[3].category = 'Transfer';
    this.tabs[4].category = 'Package';

    });
    this.loadProfiles(this.currentPage);

    this._AuthService.getUserData().subscribe(
      (data: any) => {
        // this.userData = JSON.parse(data); // Assigning the received object directly
        // this.customerForm.patchValue(this.userData);
        // this.customerForm?.get('phone')?.patchValue('+' + this.userData.phone);
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
      locationValue: [''],
      // locationValue: [''],
    });
  }
  setBookingId(arg0: any) {
    this.BookingInfo = arg0;
    this.customerForm.patchValue(this.BookingInfo);
    this.customerForm?.get('phone')?.patchValue(this.BookingInfo?.code  + this.BookingInfo.phone);
  }
  setActiveBooking(bookingId: any) {
    this.activeBooking = bookingId;
  }

  setReason(reason: any) {
    this.choosenReason = reason;
    if (this.choosenReason.id !== 4) {
      this.other = '';
    }
  }


  cancelBooking() {
    if(this.choosenReason.id !== 4) {
     this.Cancelreason =this.choosenReason.label
     console.log(this.choosenReason.label);
    }
    else  if(this.choosenReason.id == 4) {
      this.Cancelreason =this.other;
      console.log(this.other);
    }
    const model = {
      id: this.activeBooking,
      reason:this.Cancelreason
    }
    this.httpService
      .post(environment.marsa, 'user/book/cancel', model)
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
          this.loadProfiles(this.currentPage);
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

  loadProfiles(page: number): void {
    this.profileService.getProfiles(page).subscribe((data) => {
     // this.profiles = data.userDashboard.data;
      this.upcoming = data?.userDashboard?.upcomming;
      this.Transferupcoming = data?.userDashboard?.upcommingTransfer;
      this.upcomingTrips = [...(this.upcoming || []), ...(this.Transferupcoming || [])];


      console.log(this.upcomingTrips);

      this.allUpcoming = this.upcomingTrips;

      this.cdr.markForCheck();
    });
  }

  nextPage(): void {
    if (this.currentPage < this.lastPage) {
      this.loadProfiles(this.currentPage + 1);
    }
  }

  prevPage(): void {

    if (this.currentPage > 1) {
      this.loadProfiles(this.currentPage - 1);
    }
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

        note:'',
        ...this.customerForm.value,
        phone: phoneNumber.replace('+', ''),
        lng: this.longitudeValue ? this.longitudeValue.toString() : '',
        lat: this.latitudeValue ? this.latitudeValue.toString() : '',
      };

      Object.keys(model).forEach(
        (k) => (model[k] == '' || model[k]?.length == 0) && delete model[k]
      );
      console.log(this.BookingInfo);

      this.httpService
        .post(
          environment.marsa,
          'bookinfo/' + this.BookingInfo.booking_id,
          model
        )
        .subscribe({
          next: (res: any) => {
            console.log(res);
            this.BookingInfo = res.booking_information;

            // إجبار Angular على تحديث الواجهة
            this.loadProfiles(this.currentPage);

            Swal.fire(
              'Your Booking has been sent successfully.',
              '',
              'success'
            );
            // location.reload();

            this.btn?.nativeElement.click();
          },

          error: (err: any) => {

            Swal.fire(
              'Booking Failed',
              'An error occurred while processing your booking. Please try again later.',
              'error'
            ).then(() => {
            });
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
}
