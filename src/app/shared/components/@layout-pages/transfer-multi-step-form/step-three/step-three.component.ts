import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss']
})
export class StepThreeComponent {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  Coupons: any;
  total: any;
  coupon: any;
  price: any;
  kilometr: any;
  constructor(private _httpService: HttpService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
  ) {

  }
  selected: boolean = true;
  formData: any = {};
  activeTab: string = 'pills-one-example2';
  payment_method: any;
  fromId: any;
  toId: any;
  person: any;
  carId: any;
  pickuptime: any;
  way: any;
  bookingTime: any;
  bookingDate: any;
  returnbookingtime: any;
  returnbookingdate: any;
  bookdetail: any;
  selectedCar: any;
  selectedOption: any = [{}];
  selectedOptionID: any = [];
  responseData: any;
  fromName: any;
  toName: any;
  formData1: any;
  flightNumper:any;
  numberOption:any;
  cardholderName:any;
  cvv:any;
  expirYear:any;
  expiryMonth:any;
  cardNumber:any;
  activeSection:any;
  SavedaddOnDetails:any;
  AllbookingOption:any;
  ngOnInit() {
    this.way = localStorage.getItem('activeSection') || '';
    this.getDetail();
}
getDetail(){
  const bookingDetail = localStorage.getItem('bookdetail');
    const savedSelectedCar = localStorage.getItem('selectedCar');
    const savedSelectedOption = localStorage.getItem('selectedOptions');
    const savedResponseData = localStorage.getItem('responseData');
    const savedFlightNumper = localStorage.getItem('formData');
    const savedSection = localStorage.getItem('activeSection');
    const addOnDetails = localStorage.getItem('Add-on-details');

  if(bookingDetail && savedSection &&savedSelectedCar && savedSelectedOption &&
    savedResponseData && savedFlightNumper && addOnDetails)
    {
      this.responseData = JSON.parse(savedResponseData);
       this.bookdetail = JSON.parse(bookingDetail);
       this.fromId = this.bookdetail.from_id || '';
       this.toId = this.bookdetail.to_id || '';
       this.activeSection = savedSection;
       this.selectedCar = JSON.parse(savedSelectedCar);
       this.carId = this.selectedCar.id;
       this.SavedaddOnDetails = JSON.parse(addOnDetails);

      this.kilometr = this.SavedaddOnDetails?.kilometer || '';
      this.person = this.SavedaddOnDetails.Numberofpeople || '';
      this.bookingTime = this.SavedaddOnDetails.booking_time || '';
      this.bookingDate = this.SavedaddOnDetails.booking_date || '';
      this.fromName = this.SavedaddOnDetails?.from || '';

      this.toName = this.SavedaddOnDetails?.to || '';
      this.price =this.SavedaddOnDetails?.Subtotal || '';
      this.total= this.SavedaddOnDetails?.Total|| '';

      // this.returnbookingdate =  this.SavedaddOnDetails?.return_booking_date || '';
      this.returnbookingtime =  this.SavedaddOnDetails?.return_booking_time || '';
      this.AllbookingOption = this.SavedaddOnDetails?.Option || [];
      this.formData1 = JSON.parse(savedFlightNumper);
      this.flightNumper=this.formData1?.flightNumber;
      this.selectedOption = JSON.parse(savedSelectedOption);

      const dateString = this.SavedaddOnDetails?.return_booking_date || '';
if (dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  this.returnbookingdate = `${year}-${month}-${day}`;
} else {
  this.returnbookingdate = '';
}

console.log(this.returnbookingdate); 

  }
  console.log('hiii');
  console.log(this.total);
}


getImageName(url: string): string {
  const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
  return imageName || 'Unknown photo';
}

applycoupon() {
  this._httpService.get(environment.marsa, `Coupon`).subscribe((res: any) => {
    console.log(res);
    this.Coupons = res.coupon.filter((item: any) => item.code == this.coupon);
    if (this.Coupons.length > 0) {
      this.total =  this.total - this.Coupons[0].amount;
    } else {
      console.warn('No matching coupons found');
    }
    console.log(this.Coupons);
  });
  console.log(this.coupon);
}

  nextStep(): void {
    this.next.emit(this.formData);
  }

  previousStep(): void {
    this.previous.emit();
  }

  toggleSelected(): void {
    this.selected = !this.selected;
  }



  confirmBookingByCard() {
    if (this.cardholderName == undefined || this.cardNumber == undefined || this.expiryMonth == undefined || this.expirYear == undefined || this.cvv == undefined) {

      this.toastr.info('Please fill in all the required fields before confirming your booking. ', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
      return; // Stop the function if any field is missing
    }
    else {
      const bookingOption = [];

      for (const key in this.selectedOption) {
        if (this.selectedOption.hasOwnProperty(key)) {
          const option = this.selectedOption[key];
          // Extract the ID and push it to idArray
          if (option && option.id) {
            bookingOption.push({
              id: option.id,
              persons: option.number,
            });
          }
        }
      }

      const model = {
        from_id: this.fromId,
        to_id: this.toId,
        person: this.person,
        car_id: this.carId,
        way: this.way,
        booking_time: this.bookingTime,
        booking_date: this.bookingDate,
        return_booking_time: this.returnbookingtime,
        return_booking_date: this.returnbookingdate,
        payment_method: this.payment_method ? this.payment_method : 'tab',
        booking_option: bookingOption,
        flight_n: this.flightNumper,
        coupon_code: this.Coupons[0].code,
        cardholder_name: this.cardholderName,
        cvv: this.cvv.toString(),
        expiry_year: this.expirYear,
        expiry_month: this.expiryMonth,
        card_number: this.cardNumber.toString()
      };

      this._httpService.post(environment.marsa, 'transfer/book', model)
        .subscribe({
          next: (res: any) => {
            console.log(res);
            if (res && res.link) {
              window.location.href = res.link;
            } else {
              const queryParams = {
                res: JSON.stringify(res),
              };
              this.router.navigate(
                ['/', this.translate.currentLang, 'transfer', 'confirm'],
                { queryParams }
              );
              Swal.fire(
                'Your request has been sent successfully.',
                'The Tour official will contact you as soon as possible. For any further assistance, please contact us at info@marsawaves.com.',
                'success'
              );
            }
          },
          error: (err: any) => {
            console.error('Error during booking:', err);

            // Extract and display error details if available
            const errorMessage = err.error?.message || 'An error occurred while processing your booking. Please try again later.';

            Swal.fire(
              'Booking Failed',
              errorMessage,
              'error'
            );
          }
        });
    }

  }



  confirmBooking() {
    const bookingOption = [];
    for (const key in this.selectedOption) {
      if (this.selectedOption.hasOwnProperty(key)) {
        const option = this.selectedOption[key];
        if (option && option.id) {
          bookingOption.push({
            id: option.id,
            persons: option.number,
          });
        }
      }
    }

    const model = {
      from_id: this.fromId,
      to_id: this.toId,
      person: this.person,
      car_id: this.carId,
      way: this.way,
      booking_time: this.bookingTime,
      booking_date: this.bookingDate,
      return_booking_time: this.returnbookingtime,
       return_booking_date: this.returnbookingdate,
      payment_method: this.payment_method ? this.payment_method : 'cash',
      booking_option: bookingOption,
      flight_n: this.flightNumper,
      coupon_code: this.Coupons?.[0]?.code || '', // Safely access coupon code or fallback
    };

    this._httpService.post(environment.marsa, 'transfer/book', model).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res && res.link) {
          window.location.href = res.link;
        } else {
          const queryParams = { res: JSON.stringify(res) };
          this.router.navigate(
            ['/', this.translate.currentLang, 'transfer', 'confirm'],
            { queryParams }
          );
          Swal.fire(
            'Your request has been sent successfully.',
            'The Tour official will contact you as soon as possible. For further communication, please reach out to info@marsawaves.com',
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
      },
    });
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    console.log('Pasting is not allowed!');
  }
  goback() {
    this.router.navigate(
      ['/', this.translate.currentLang, 'transfer'],

    );
  }

  toggleTab(tabId: string, paymentMethod: string) {
    this.activeTab = tabId;
    this.payment_method = paymentMethod;
  }

  isActiveTab(tabId: string): boolean {
    return this.activeTab === tabId;
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



