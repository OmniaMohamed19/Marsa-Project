import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DatePipe, Location } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { environment } from 'src/environments/environment.prod';
import { HttpService } from 'src/app/core/services/http/http.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MapModalComponent } from 'src/app/shared/components/@layout-pages/map-modal/map-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { CabinInfoModalComponent } from '../../../../../shared/sliders/cabin-info-modal/cabin-info-modal.component';
import Swal from 'sweetalert2';
import { Observable, map, startWith } from 'rxjs';
import { Code } from '../../context/code.interface';

@Component({
  selector: 'app-liveboard-payment',
  templateUrl: './liveboard-payment.component.html',
  styleUrls: ['./liveboard-payment.component.scss'],
})
export class LiveboardPaymentComponent implements OnInit {
  class: any;
  liveabourdData: any;
  cabins: any;
  tripId: any;
  responseFromAvailableOption: any;
  adult: any;
  persons: number = 0;
  customerForm!: FormGroup;
  activeTab: string = 'pills-one-example2';
  payment_method: any;
  userData: any;
  canProceedToCustomerInfo: boolean = false;
  isConfirmationStepEnabled: boolean = false;
  schedules_id: any;
  filteredNationalities: Observable<Code[]> | undefined;
  showServices: boolean = true;

  nationalities!: Code[];
  // map
  @ViewChild('mapModalDeatails') mapModalDeatails: ElementRef | undefined;
  locationValue = '';
  latitudeValue: any;
  longitudeValue: any;
  activeexclude: any = -1;
  personsMap: { [key: string]: number } = {};
  mapModalOptions: any = {
    headerTitle: 'location',
    modalname: 'mapModalDeatails',
  };

  constructor(
    private location: Location,
    private _httpService: HttpService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _AuthService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {}

  setDisplay(id: any) {
    this.activeexclude = id;
    // if (document.getElementById(id)?.style.display == 'none') {
    //   document.getElementById(id)?.setAttribute('style', 'display:block');
    // } else {
    //   document.getElementById(id)?.setAttribute('style', 'display:none');
    // }
  }

  ngOnInit(): void {
    this.initForm();
    this.getNationality();
    this.route.queryParams.subscribe((params: any) => {
      this.schedules_id = params['schedules_id'];
      this.tripId = params['trip_id'];
      this.adult = params['adult'];
      this.getDataById(this.tripId);
      this.getCabinBySchedulesId(this.tripId, this.schedules_id);
    });
    this._AuthService.getUserData().subscribe(
      (data: any) => {
        this.userData = JSON.parse(data);
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
      nationality: ['', [Validators.required]],
      note: [''],
      pickup_point: [''],
      locationValue: [''],
    });
  }

  getDataById(Id: any) {
    this._httpService
      .get(environment.marsa, `liveboard/details/` + Id)
      .subscribe((res: any) => {
        this.liveabourdData = res?.tripDetails;
      });
  }

  getCabinBySchedulesId(id: any, schedulesId: any) {
    this._httpService
      .get(environment.marsa, `liveboard/getcabin/` + id + `/` + schedulesId)
      .subscribe((res: any) => {
        this.cabins = res?.cabins;
      });
  }

  goToPayment(stepper: MatStepper) {
    if (this.customerForm.valid) {
      // Your logic to navigate to the next step
      stepper.next();
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

  incrementAdult(item: any) {
    const totalPersons = Object.values(this.personsMap).reduce(
      (acc: number, val: number) => acc + val,
      0
    );
    if (totalPersons >= this.adult) {
      this.toastr.info('Total number of persons cannot exceed ' + this.adult);
      // this.canProceedToCustomerInfo = true;
      return;
    }
    if (!this.personsMap[item.id]) {
      this.personsMap[item.id] = 0;
    }
    if (this.personsMap[item.id] < item.available) {
      this.personsMap[item.id]++;
    }
  }

  decrementAdult(item: any) {
    if (!this.personsMap[item.id]) {
      this.personsMap[item.id] = 0; // Initialize persons value for the item if not already set
    }
    if (this.personsMap[item.id] > 1) {
      this.personsMap[item.id]--;
    }
  }

  getValue(item: any): number {
    return item;
  }

  openCabinSliderModal(cabin: any): void {
    const boatImages = cabin.images;
    const dialogRef = this.dialog.open(CabinInfoModalComponent, {
      width: '60%',
    });
    dialogRef.componentInstance.images = boatImages;
    dialogRef.componentInstance.data = cabin;
  }

  toggleTab(tabId: string, paymentMethod: string) {
    this.activeTab = tabId;
    this.payment_method = paymentMethod;
  }

  isActiveTab(tabId: string): boolean {
    return this.activeTab === tabId;
  }

  goToNextStep(stepper: MatStepper) {
    const totalPersons = Object.values(this.personsMap).reduce(
      (acc: number, val: number) => acc + val,
      0
    );
    if (totalPersons < this.adult) {
      this.toastr.info('Please allocate all Persons before proceeding.');
      return;
    } else {
      const model = {
        trip_id: this.tripId,
        class: 'collective',
        adult: this.adult,
        schedules_id: this.schedules_id,
        cabins: this.cabins
          .map((cabin: any) => ({
            id: cabin.id,
            persons:
              this.personsMap[cabin.id] !== 0
                ? this.personsMap[cabin.id]
                : undefined,
          }))
          .filter((cabin: any) => cabin.persons !== undefined),
      };
      this._httpService
        .post(environment.marsa, 'liveboard/cabin/price', model)
        .subscribe({
          next: (res: any) => {
            this.responseFromAvailableOption = res;
            stepper.next();
          },
        });
    }
  }

  goToPreviousStep(stepper: MatStepper) {
    stepper.previous();
  }

  confirmBooking() {
    if (this.customerForm.valid) {
      let phoneNumber = this.customerForm.get('phone')?.value['number'];

      const model = {
        trip_id: this.tripId,
        // userid: this.userData?.id,
        class: 'collective',
        adult: this.adult,
        schedules_id: this.schedules_id,
        payment_method: this.payment_method ? this.payment_method : 'cash',
        ...this.customerForm.value,
        phone: phoneNumber.replace('+', ''),
        lng: this.longitudeValue ? this.longitudeValue.toString() : '',
        lat: this.latitudeValue ? this.latitudeValue.toString() : '',
        cabins: this.cabins
          .map((cabin: any) => ({
            id: cabin.id,
            persons:
              this.personsMap[cabin.id] !== 0
                ? this.personsMap[cabin.id]
                : undefined,
          }))
          .filter((cabin: any) => cabin.persons !== undefined),
      };

      this._httpService
        .post(environment.marsa, 'liveboard/book', model)
        .subscribe({
          next: (res: any) => {
            const queryParams = {
              res: JSON.stringify(res),
              trip_id: this.tripId,
            };
            this.router.navigate(
              ['/', this.translate.currentLang, 'liveboard', 'confirm'],
              { queryParams }
            );
            Swal.fire(
              'Your request has been send successfully.',
              'The Liveabourd official will contact you as soon as possible to communicate with us , please send us at info@marsawaves.com',
              'success'
            );
          },
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

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    margin: 10,
    navSpeed: 700,
    // navText: ["", ""],
    responsive: {
      0: {
        items: 1, // Display one item per slide for smaller screen sizes
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
    // nav: true
  };

  goBack() {
    this.location.back();
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
