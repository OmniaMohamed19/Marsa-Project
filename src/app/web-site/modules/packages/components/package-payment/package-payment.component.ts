import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { environment } from 'src/environments/environment.prod';
import { HttpService } from 'src/app/core/services/http/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MapModalComponent } from 'src/app/shared/components/@layout-pages/map-modal/map-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Observable, map, startWith } from 'rxjs';
import { Code } from '../../context/code.interface';

@Component({
  selector: 'app-package-payment',
  templateUrl: './package-payment.component.html',
  styleUrls: ['./package-payment.component.scss']
})
export class PackagePaymentComponent {
  packageData: any;
  responseFromAvailableOption: any;
  customerForm!: FormGroup;
  activeTab: string = 'pills-one-example2';
  payment_method: any;
  userData: any;
  canProceedToCustomerInfo: boolean = false;
  isConfirmationStepEnabled: boolean = false;
  filteredNationalities: Observable<Code[]> | undefined;
  showServices: boolean = true;
  nationalities!: Code[];
  coupon='';
  Coupons:any;
  Total:any;
  // map
  @ViewChild('mapModalDeatails') mapModalDeatails: ElementRef | undefined;
  locationValue = '';
  latitudeValue: any;
  longitudeValue: any;
  personsMap: { [key: string]: number } = {};
  mapModalOptions: any = {
    headerTitle: 'location',
    modalname: 'mapModalDeatails',
  };

  model = {
    adult: '',
    booking_date: '',
    childern: '',
    infant: '',
    packege_id: ''
  }
  end_date : string='';
  tripletails: any;
  edit: boolean=false;
  cardholderName: any;
  cvv: any;
  expirYear: any;
  expiryMonth: any;
  cardNumber: any;
  constructor(
    private location: Location,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _AuthService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.initForm();
    this.edit=localStorage['edit']?localStorage['edit']:false
    this.getNationality();
    this.route.queryParams.subscribe((params: any) => {
      console.log('params', params);
      const parsedRes = JSON.parse(params['res']);
      this.responseFromAvailableOption = parsedRes;
      console.log('this.responseFromDetails' ,this.responseFromAvailableOption);

      this.model.adult = params['adult'];
      this.model.booking_date = params['booking_date'];
      this.model.childern = params['childern'];
      this.model.infant = params['infant'];
      this.model.packege_id = params['packege_id'];
      this.end_date = params['end_date'];
      this.getDataById(this.model.packege_id);

    })
    this._AuthService.getUserData().subscribe((data: any) => {
      this.userData = JSON.parse(data);
      this.customerForm.patchValue(this.userData);
      this.customerForm?.get('phone')?.patchValue('+'+this.userData.phone);

    }, (error) => {
      // Handle error if needed
      console.error('Error:', error);
    });

  }
  getTripById(activityID: any) {
    this._httpService
      .get(
        environment.marsa,
        `Activtes/details/` + activityID
      )
      .subscribe((res: any) => {
        this.tripletails=res.tripDetails
        // console.log(res);
      });
  }
  confirmEdit(event: Event){
    if (this.customerForm.valid) {
      let phoneNumber = this.customerForm.get('phone')?.value['number'];
      let code = this.customerForm.get('phone')?.value['dialCode'];

      const model = {
        code:code,
        ...this.model,
        payment_method: this.payment_method ? this.payment_method : 'tap',
        ...this.customerForm.value,
        phone: phoneNumber.replace("+", ""),
        lng: this.longitudeValue ? this.longitudeValue.toString() : '',
        lat: this.latitudeValue ? this.latitudeValue.toString() : '',

      };

      console.log(model);

      this._httpService.post(environment.marsa, 'bookinfo/'+'8', model).subscribe({
        next: (res: any) => {
          console.log(res);
          // if (res && res.link) {
          //   window.location.href = res.link;
          // } else {
            this.getTripById(this.model.packege_id)
            this.router.navigate(
            ['/', this.translate.currentLang, 'packages', 'packageDetails',this.tripletails?.id,
                            this.tripletails?.Name]
              );
              localStorage.removeItem('edit')
              localStorage.removeItem('queryParams')
            Swal.fire(
              'Your request has been send successfully',
              'Your request has been sent successfully. Please check your email for further instructions.',
              'success'
            );
          }
        // },
      })
    } else {
      // Mark all form controls as touched to trigger validation messages
      this.markFormGroupTouched(this.customerForm);
    }
  }
  initForm() {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      note: [''],
      pickup_point: ['',!this.showServices?[Validators.required]:[]],
      locationValue: [''],
    })
  }

  getDataById(Id: any) {
    this._httpService
      .get(
        environment.marsa,
        `package/details/` + Id
      )
      .subscribe((res: any) => {
        this.packageData = res?.tripDetails;
      });
  }



  goToPayment(stepper: MatStepper) {
    console.log(this.customerForm.valid);

    if (!this.showServices) {
        this.locationValue = "ddd";
    }

    // Update pickup_point validator based on showServices
    if (this.showServices) {
        this.customerForm.get('pickup_point')?.setValidators([Validators.required]);
    } else {
        this.customerForm.get('pickup_point')?.clearValidators();
        this.customerForm.get('pickup_point')?.updateValueAndValidity();
    }

    // Adjusted conditional to handle TypeScript's type checking
    if (this.customerForm.valid && (this.locationValue && ( this.locationValue != ''))) {
        stepper.next();
    } else {
        this.markFormGroupTouched(this.customerForm);
    }
}


  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }



  toggleTab(tabId: string, paymentMethod: string) {
    this.activeTab = tabId;
    this.payment_method = paymentMethod;
  }

  isActiveTab(tabId: string): boolean {
    return this.activeTab === tabId;
  }




  goToPreviousStep(stepper: MatStepper) {
    stepper.previous();
  }

  applycoupon(){
    this._httpService
      .get(environment.marsa, `Coupon`)
      .subscribe((res: any) => {
        console.log(res);
        this.Coupons=res.coupon.filter((item:any) =>  item.code == this.coupon)
        this.Total=this.responseFromAvailableOption?.TotlaPrice - this.Coupons[0].amount
    console.log(this.Total);
  });
    console.log(this.coupon);
    // Coupon
  }
  confirmBookingByCard(event: Event){
    if (this.customerForm.valid) {
      let phoneNumber = this.customerForm.get('phone')?.value['number'];
      let code = this.customerForm.get('phone')?.value['dialCode'];

      const model = {
        code:code,
        ...this.model,
        payment_method: this.payment_method ? this.payment_method : 'tap',
        ...this.customerForm.value,
        phone: phoneNumber.replace("+", ""),
        lng: this.longitudeValue ? this.longitudeValue.toString() : '',
        lat: this.latitudeValue ? this.latitudeValue.toString() : '',
        cardholder_name: this.cardholderName,
        cvv: this.cvv.toString(),
        expiry_year: this.expirYear,
        expiry_month: this.expiryMonth,
        card_number: this.cardNumber.toString(),
      };

      console.log(model);

      this._httpService.post(environment.marsa, 'package/book', model).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res && res.link) {
            window.location.href = res.link;
          } else {
            Swal.fire(
              'Your request has been send successfully',
              'Your request has been sent successfully. Please check your email for further instructions.',
              'success'
            );
          }
        },
      })
    } else {
      // Mark all form controls as touched to trigger validation messages
      this.markFormGroupTouched(this.customerForm);
    }
}

  confirmBooking() {
    if (this.customerForm.valid) {
      let phoneNumber = this.customerForm.get('phone')?.value['number'];
      let code = this.customerForm.get('phone')?.value['dialCode'];

      const model = {
        code:code,
      ...this.model,
      payment_method: this.payment_method ? this.payment_method : 'cash',
      ...this.customerForm.value,
      phone: phoneNumber.replace("+", ""),
      lng: this.longitudeValue ? this.longitudeValue.toString() : '',
      lat: this.latitudeValue ? this.latitudeValue.toString() : '',

    };

    console.log(model);

    this._httpService.post(environment.marsa, 'package/book', model).subscribe({
      next: (res: any) => {
        const queryParams = {
          res: JSON.stringify(res),
          packege_id: this.model.packege_id,
        }
        this.router.navigate(['/', this.translate.currentLang, 'packages', 'packageConfirm'], { queryParams });
        Swal.fire(
          'Your request has been send successfully.',
          'The Liveabourd official will contact you as soon as possible to communicate with us , please send us at info@marsawaves.com',
          'success'
        );
      }
    })
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
        mapModalOptions: this.mapModalOptions
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
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

  goBack() {
    this.location.back();
  }


  getNationality() {
    this._httpService.get('marsa', 'countrycode').subscribe({
      next: (nationalities: any) => {
        this.nationalities = nationalities.code;
        if (this.customerForm && this.customerForm.get('nationality')) {
          this.filteredNationalities = this.customerForm.get('nationality')?.valueChanges.pipe(
            startWith(''),
            map(value => this._filterNationalities(value))
          );
        }

      }
    })
  }

  private _filterNationalities(value: any): Code[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.nationalities.filter(nationality => nationality.name.toLowerCase().includes(filterValue));
  }
  letterOnly(event: any) {
    var charCode = event.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)

      return true;
    else
      return false;
  }

  public OnlyNumbers(event: any) {
    let regex: RegExp = new RegExp(/^[0-9]{1,}$/g);
    let specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft'];
    if (specialKeys.indexOf(event.key) !== -1) {
      return;
    } else {
      if (regex.test(event.key)) {
        return true;
      } else {
        return false;
      }
    }
  }
}
