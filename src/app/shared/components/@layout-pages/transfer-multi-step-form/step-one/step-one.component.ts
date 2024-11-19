import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpService } from 'src/app/core/services/http/http.service';
import { DataService } from 'src/app/web-site/modules/transfer/dataService';
import { environment } from 'src/environments/environment.prod';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<any>();

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
  return_date:any;
  return_time:any;
  activeSection:any;
  Isairport:boolean=false;
  selectedCar: any = null;  // To store the selected car object
details:any;
  customOptions: any = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    center: false,
    dots: false,
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
    from_id:'',
    to: '',
    flightNumber: '',
    phoneNumber: '',
    date: '',
    pickuptime: '',
    personsTotal: 0,
    specialRequirements: '',
    selectedCarId: null ,

  };
  countries: any;

  constructor(private toastr: ToastrService,private dataService: DataService, private httpService: HttpService) {}

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
    this.return_date= localStorage.getItem('returnDate');
    this.return_time= localStorage.getItem('returnPickuptime');
    const savedSection = localStorage.getItem('activeSection');
    if (savedSection) {
      this.activeSection = savedSection;

    }
    const selectedFromType = localStorage.getItem('selectedFromType');
    if (selectedFromType === 'airport') {
      this.Isairport=true;

    }


    this.formData.from_id=this.details?.from_id|| '';
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
  onCarClick(event:any, carId: number): void {
    this.selectedCarId = carId;
    this.formData.selectedCarId = carId;

    const selectedCarObject = this.responseData?.car?.find((car: any) => car.id === carId);

    if (selectedCarObject) {
      this.selectedCar = selectedCarObject;
      localStorage.setItem('selectedCar', JSON.stringify(this.selectedCar));
    }
  }
  // Function to proceed to the next step
  saveFormData(form: NgForm): void {

    if (form.valid && this.selectedCarId!=undefined) {
      // Save the entire formData to localStorage
      localStorage.setItem('formData', JSON.stringify(this.formData));
      this.next.emit();
      window.scrollTo(0, 0);
    }
    else{
      if (form.valid==false) {
        this.toastr.info('Please enter all required fields. ', '', {
          disableTimeOut: false,
          titleClass: 'toastr_title',
          messageClass: 'toastr_message',
          timeOut: 5000,
          closeButton: true,
        });
        // if (this.formData.phoneNumber==null) {
        //   this.toastr.info('Please enter your Phone Number. ', '', {
        //     disableTimeOut: false,
        //     titleClass: 'toastr_title',
        //     messageClass: 'toastr_message',
        //     timeOut: 5000,
        //     closeButton: true,
        //   });

        // }

      }

      if (this.selectedCarId==undefined) {

        this.toastr.info('Please choose a car before booking. ', '', {
          disableTimeOut: false,
          titleClass: 'toastr_title',
          messageClass: 'toastr_message',
          timeOut: 5000,
          closeButton: true,
        });
      }

    }


  }
  updatePersonsTotal() {
    this.formData.personsTotal = this.adultCount + this.childCount + this.infantCount;
  }

  previousStep(): void {
    this.previous.emit();
  }
}
