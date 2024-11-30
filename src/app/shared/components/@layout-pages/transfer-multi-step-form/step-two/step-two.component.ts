import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})
export class StepTwoComponent implements OnInit {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  formData: any = {
    selectedOptions: {} // To store the selected options
  };
  responseData: any;
  savedSelectedOpti: any;
  numberOfOption: any;
  bookdetail: any;
  fromId: any;
  way: any;
  toId: any;
  person: any;
  carId: any;
  pickuptime: any;
  bookingDate: any;
  bookingTime: any;
  kilometr: any;
  flightNumper: any;
  formData1: any;
  returnbookingtime: any;
  returnbookingdate: any;
  optionId:any;

  constructor(private toastr: ToastrService, private _httpService: HttpService,) { }

  ngOnInit() {
    this.returnbookingdate = localStorage.getItem('returnDate') || '';


    const savedFlightNumper = localStorage.getItem('formData');

    if (savedFlightNumper) {
      this.formData1 = JSON.parse(savedFlightNumper);
      this.flightNumper = this.formData1?.flightNumber;
      console.log(this.formData1)

    }
    this.returnbookingtime = localStorage.getItem('returnPickuptime') || '';

    this.way = localStorage.getItem('activeSection') || '';

    const bookingDetail = localStorage.getItem('bookdetail');
    if (bookingDetail) {
      this.bookdetail = JSON.parse(bookingDetail);
      console.log(this.bookdetail);
    }

    if (this.bookdetail) {
      this.fromId = this.bookdetail.from_id || '';
      this.toId = this.bookdetail.to_id || '';
      this.bookingDate = this.bookdetail.date || '';
      this.bookingTime = this.bookdetail.pickuptime || '';
      this.person = this.bookdetail.person || '';
      this.kilometr = this.bookdetail.kilometr || '';
    } else {
      console.warn(' bookdetail is undefined or null');
    }

    const savedResponseData = localStorage.getItem('responseData');
    if (savedResponseData) {
      this.responseData = JSON.parse(savedResponseData);


      const savedSelectedOptions = localStorage.getItem('selectedCar');
      if (savedSelectedOptions) {
        this.savedSelectedOpti = JSON.parse(savedSelectedOptions);
        this.savedSelectedOpti.option.forEach((opt: any) => {
          opt.number = opt.number || 0;
        });
      } else {
        this.savedSelectedOpti = { option: [] };
      }

      this.formData.selectedOptions = {};
    }
  }

  getImageName(url: string): string {
    const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }
  onOptionChange(option: any, event: any): void {
    if (event.target.checked) {
      this.formData.selectedOptions[option.name] = option;
    } else {
      delete this.formData.selectedOptions[option.name];
    }
    if (typeof window !== 'undefined' && window.localStorage) {

      localStorage.setItem('selectedOptions', JSON.stringify(this.formData.selectedOptions));
    }
  }

  savenumberOfOption(option: any): void {
    option.number = Math.max(0, option.number || 0);


    // localStorage.setItem('numberOption', this.numberOfOption.toString());

  }

  nextStep(): void {
    const invalidOptions = Object.values(this.formData.selectedOptions).filter((option: any) => {
      this.optionId= option.number;
      return option && (!option.number || option.number <= 0);
    });
    console.log(this.optionId);

    if (invalidOptions.length > 0) {
      this.toastr.info('Please enter a valid number for the selected option!', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
      return;
    }


    localStorage.setItem('selectedOptions', JSON.stringify(this.formData.selectedOptions));
   console.log(this.formData.selectedOptions.id)
    const bookingOption = [];

    bookingOption.push({
      id: this.formData.selectedOptions.id,
      persons: this.formData.selectedOptions.number,
    });

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
      booking_option: bookingOption,
      flight_n: this.flightNumper,
    };

    this._httpService.post(environment.marsa, 'transfer/get/price', model)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          if (res) {
          localStorage.setItem("Add-on-details", res);
          }
        }

      });
    this.next.emit(this.formData);
    window.scrollTo(0, 0);
  }

  confirmBooking() {
    // Initialize bookingOption array

  }


  previousStep(): void {
    this.previous.emit();
  }
}
