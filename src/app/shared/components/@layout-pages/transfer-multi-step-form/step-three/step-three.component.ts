import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss']
})
export class StepThreeComponent {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  Coupons: any;
  Total: any;
  coupon: any;
  price: any;
  kilometr: any;
  constructor(private _httpService: HttpService,

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

  cardholderName:any;
  cvv:any;
  expirYear:any;
  expiryMonth:any;
  cardNumber:any;
  ngOnInit() {
    this.returnbookingdate = localStorage.getItem('returnDate') || '';
    this.returnbookingtime = localStorage.getItem('returnPickuptime') || '';

    this.way = localStorage.getItem('activeSection') || '';

    const bookingDetail = localStorage.getItem('bookdetail');
    const savedSelectedCar = localStorage.getItem('selectedCar');
    const savedSelectedOption = localStorage.getItem('selectedOptions');
    const savedResponseData = localStorage.getItem('responseData');
    const savedFlightNumper = localStorage.getItem('formData');

    if (savedResponseData) {
      this.responseData = JSON.parse(savedResponseData);
    }
    this.fromName = this.responseData?.booking?.from || '';
    this.toName = this.responseData?.booking?.to || '';

    if (bookingDetail) {
      this.bookdetail = JSON.parse(bookingDetail);
      console.log(this.bookdetail);
    }
  console.log("hiiiioo");
    if (savedFlightNumper) {
      this.formData1 = JSON.parse(savedFlightNumper);
      this.flightNumper=this.formData1?.flightNumber;
     console.log(this.formData1)
      console.log(this.flightNumper);
    }
    if (savedSelectedCar) {
      this.selectedCar = JSON.parse(savedSelectedCar);
      this.carId = this.selectedCar.id;
    }
    if (savedSelectedOption) {
      this.selectedOption = JSON.parse(savedSelectedOption);
      console.log(this.selectedOption)
    }
    this.fromId = this.bookdetail.from_id;
    this.toId = this.bookdetail.to_id;
    this.bookingDate = this.bookdetail.date;
    this.bookingTime = this.bookdetail.pickuptime;
    this.person = this.bookdetail.person;
    this.price = this.bookdetail.price;
    this.kilometr = this.bookdetail.this.bookdetail;

  }

  applycoupon() {
    this._httpService
      .get(environment.marsa, `Coupon`)
      .subscribe((res: any) => {
        console.log(res);
        this.Coupons = res.coupon.filter((item: any) => item.code == this.coupon)
        this.Total = this.Total - this.Coupons[0].amount
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

  // confirmBookingByCard() {

  //   const bookingOption = [];

  //   for (const key in this.selectedOption) {
  //     if (this.selectedOption.hasOwnProperty(key)) {
  //       const option = this.selectedOption[key];
  //       // Extract the ID and push it to idArray
  //       if (option && option.id) {
  //         bookingOption.push({
  //           id: option.id,
  //           persons: this.person,
  //         });
  //       }
  //     }
  //   }
  //   const model = {
  //     from_id: this.fromId,
  //     to_id: this.toId,
  //     person: this.person,
  //     car_id: this.carId,
  //     way: this.way,
  //     booking_time: this.bookingDate,
  //     booking_date: this.bookingDate,
  //     return_booking_time: this.returnbookingtime,
  //     return_booking_date: this.returnbookingdate,
  //     payment_method: this.payment_method ? this.payment_method : 'tap',
  //     booking_option: bookingOption,
  //     flight_n:this.flightNumper,
  //     coupon_code:'123',
  //     cardholder_name:this.cardholderName,
  //     cvv:this.cvv,
  //     expiry_year:this.expirYear,
  //     expiry_month:this.expiryMonth,
  //     card_number:this.cardNumber
  //   };

  //   this._httpService.post(environment.marsa, 'transfer/book', model)
  //   .subscribe({
  //     next: (res: any) => {
  //       console.log(res);
  //       const queryParams = {
  //         res: JSON.stringify(res),

  //       };
  //       this.router.navigate(
  //         ['/', this.translate.currentLang, 'transfer', 'confirm'],
  //         { queryParams }
  //       );
  //       Swal.fire(
  //         'Your request has been send successfully.',
  //         'The Tour official will contact you as soon as possible to communicate with us, please send us at info@marsawaves.com',
  //         'success'
  //       );
  //     },
  //     error: (err: any) => {
  //       console.error('Error during booking:', err);
  //       Swal.fire(
  //         'Booking Failed',
  //         'An error occurred while processing your booking. Please try again later.',
  //         'error'
  //       );
  //     }
  //   });
  // }

  confirmBookingByCard() {
    // Initialize bookingOption array
    const bookingOption = [];

    for (const key in this.selectedOption) {
      if (this.selectedOption.hasOwnProperty(key)) {
        const option = this.selectedOption[key];
        // Extract the ID and push it to idArray
        if (option && option.id) {
          bookingOption.push({
            id: option.id,
            persons: this.person,
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
      flight_n:this.flightNumper,
      coupon_code:'123',
      cardholder_name:this.cardholderName,
      cvv:this.cvv,
      expiry_year:this.expirYear,
      expiry_month:this.expiryMonth,
      card_number:this.cardNumber
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
  }


  confirmBooking() {
    // Initialize bookingOption array
    const bookingOption = [];

    for (const key in this.selectedOption) {
      if (this.selectedOption.hasOwnProperty(key)) {
        const option = this.selectedOption[key];
        // Extract the ID and push it to idArray
        if (option && option.id) {
          bookingOption.push({
            id: option.id,
            persons: this.person,
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
      flight_n:this.flightNumper,
      coupon_code:'123'
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

}
