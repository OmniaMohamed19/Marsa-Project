import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpService } from 'src/app/core/services/http/http.service';
import { DataService } from 'src/app/web-site/modules/transfer/dataService';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<any>();

  activeSection = 'section1';
  responseData: any;
  selectedItemId: number | null = null;
  userDetails: any;
  phone: any;
  phoneNumber: any;
  bookdetail: any;
  adultCount = 0;
  childCount = 0;
  infantCount = 0;
  selectedCarId: any;
  selectedCar: any = null;  // To store the selected car object

  customOptions: any = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    center: false,
    dots: true,
    margin: 10,
    rtl: false,
    nav: true,
    navText: [
      '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
      '<i class="fa fa-chevron-right" aria-hidden="true"></i>'
    ],
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      1000: {
        items: 3
      }
    }
  };

  formData: any = {
    from: '',
    to: '',
    flightNumber: '',
    phoneNumber: '',
    date: '',
    pickuptime: '',
    personsTotal: 0,
    specialRequirements: '',
    selectedCarId: null  // Store the selected car ID
  };
  countries: any;

  constructor(private dataService: DataService, private httpService: HttpService) {}

  ngOnInit() {
    // Fetch user details and country data
    this.httpService.get(environment.marsa, 'profile').subscribe((res: any) => {
      this.userDetails = res?.userDashboard;
      this.phone = this.userDetails?.overviwe?.phonenumber;
      this.phoneNumber = '+' + this.userDetails?.overviwe?.countrycode + this.phone.replace(/\s/g, '');
      this.formData.phoneNumber = this.phoneNumber || '';
    });

    this.httpService.get(environment.marsa, 'countrycode').subscribe((res: any) => {
      this.countries = res;
    });

    // Retrieve saved data from localStorage
    const savedResponseData = localStorage.getItem('responseData');
    const bookingDetail = localStorage.getItem('bookdetail');
    const savedSelectedCar = localStorage.getItem('selectedCar');  // Retrieve selected car from localStorage

    if (savedResponseData) {
      this.responseData = JSON.parse(savedResponseData);
    }
    if (bookingDetail) {
      this.bookdetail = JSON.parse(bookingDetail);
    }
    if (savedSelectedCar) {
      this.selectedCar = JSON.parse(savedSelectedCar);  // Load the saved car object
      this.formData.selectedCarId = this.selectedCar.id;  // Set the car ID in formData
    }

    // Set other form fields from responseData
    this.formData.from = this.responseData?.booking?.from || '';
    this.formData.to = this.responseData?.booking?.to || '';
    this.formData.pickuptime = this.bookdetail?.pickuptime || '';
    this.formData.date = this.bookdetail?.date || '';
  }

  // Save selected car in local storage when a car is clicked
  onCarClick(event: any, carId: number): void {
    this.selectedCarId = carId;
    this.formData.selectedCarId = carId;
        console.log(this.selectedCarId)
    // Find the selected car object from responseData
    const selectedCarObject = this.responseData?.car?.find((car: any) => car.id === carId);

    if (selectedCarObject) {
      this.selectedCar = selectedCarObject;
      // Save the entire car object in localStorage
      localStorage.setItem('selectedCar', JSON.stringify(this.selectedCar));
    }
  }

  // Function to proceed to the next step
  saveFormData(form: NgForm): void {
    if (form.valid) {
      // Save the entire formData to localStorage
      localStorage.setItem('formData', JSON.stringify(this.formData));
      this.next.emit();
    } else {
      console.log('Form is not valid');
    }
  }

  // Additional methods (increase, decrease, etc.) remain the same
  increase(type: string) {
    if (type === 'adult') {
      this.adultCount++;
    } else if (type === 'child') {
      this.childCount++;
    } else if (type === 'infant') {
      this.infantCount++;
    }
    this.updatePersonsTotal();
  }

  decrease(type: string) {
    if (type === 'adult' && this.adultCount > 0) {
      this.adultCount--;
    } else if (type === 'child' && this.childCount > 0) {
      this.childCount--;
    } else if (type === 'infant' && this.infantCount > 0) {
      this.infantCount--;
    }
    this.updatePersonsTotal();
  }

  updatePersonsTotal() {
    this.formData.personsTotal = this.adultCount + this.childCount + this.infantCount;
  }

  previousStep(): void {
    this.previous.emit();
  }
}
