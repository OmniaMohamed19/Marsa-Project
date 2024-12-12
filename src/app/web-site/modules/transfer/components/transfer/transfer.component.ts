import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { DataService } from '../../dataService';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from 'src/app/shared/services/header.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { OwlOptions } from 'ngx-owl-carousel-o';

import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],

})
export class TransferComponent implements OnInit {
  formData: any = {};
  persons: number = 2;
  transferDetails: any;
  fromId: string = '';
  toId: any;

  date: string | null = null; // Initialize the date variable
  minDate: string;
  minSelectableDate: Date = new Date();
  reviews: any;
  pickuptime: any;
  returnDate: any; // Add for return date
  returnPickuptime: any; // Add for return pickup time
  person: any;
  currentBackgroundImage: string = '';
  currentIndex: number = 0;
  interval: any;
  backgroundImageUrl: any = [];
  isLogin: boolean = false;

  highestRatedReview: any;
  transferstext: any;
  pText: any;
  h1Text: any;
  searchFrom: string = ''; // Holds the search term for the first dropdown (From)
  searchTo: string = ''; // Holds the search term for the second dropdown (To)
  minReturnDate: Date | null = null;
  filteredFromAirports: any[] = []; // Filtered airports for the first dropdown
  filteredFromHotels: any[] = []; // Filtered hotels for the first dropdown
  filteredToOptions: any[] = []; // Filtered options for the second dropdown
  selectedStar: number = 0;
  starNumber: any=null;
  comment: any=null;
  constructor(
    private httpService: HttpService,
    private router: Router,
    private dataService: DataService,
    private translate: TranslateService,
    private headerService: HeaderService,
    private _AuthService: AuthService,
    private toastr: ToastrService,
    private titleService: Title,

  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }


  updateMinReturnDate() {
    if (this.date) {
      this.minReturnDate = new Date(this.date);
      this.minReturnDate.setDate(this.minReturnDate.getDate() + 1); // Ensure at least the next day
    }
  }
  ngOnInit(): void {
    this.titleService.setTitle('Transfer');

    this.filteredFromAirports = this.transferDetails?.airports || [];
    this.filteredFromHotels = this.transferDetails?.hotel || [];
    this.filteredToOptions = [];
    this._AuthService.$isAuthenticated.subscribe((isAuth: any) => {
      this.isLogin = isAuth;
    });
    this.httpService.get(environment.marsa, 'Background').subscribe(
      (res: any) => {
        this.backgroundImageUrl = res?.transfer || [];
        this.transferstext = res?.transferstext;
        console.log(this.backgroundImageUrl);
        if (this.backgroundImageUrl.length > 0) {
          this.currentBackgroundImage = this.backgroundImageUrl[0];
        }
        if (this.transferstext) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(this.transferstext, 'text/html');

          // Extract h1 content
          const h1Element = doc.querySelector('h1');
          this.h1Text = h1Element ? h1Element.textContent : null;

          // Extract p content
          const pElement = doc.querySelector('p');
          this.pText = pElement ? pElement.textContent : null;
        }
      },
      (err) => { }
    );
    interface Review {
      rate: any;
    }
    this.httpService.get(environment.marsa, 'transfer').subscribe({
      next: (res: any) => {
        this.transferDetails = res;

        if (this.transferDetails?.reviwe) {
          this.reviews = Object.values(this.transferDetails.reviwe);

          if (this.reviews.length > 0) {
            const highestRatedReview = this.reviews.reduce((prev: Review, current: Review) => {
              return (prev.rate > current.rate) ? prev : current;
            });

            this.highestRatedReview = highestRatedReview;
            console.log('Highest Rated Review:', this.highestRatedReview);
          }
        }
      },
      error: (err) => {
        console.error('Error fetching transfer details', err);
      }
    });


  }



  onDateSelect(selectedDate: Date): void {
    this.date = this.formatDateToYYYYMMDD(selectedDate);
    console.log(this.date);
  }

  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onTimeSelect(event: Date) {
    const hours = event.getHours() > 12 ? event.getHours() - 12 : event.getHours();
    const minutes = event.getMinutes().toString().padStart(2, '0');
    const ampm = event.getHours() >= 12 ? 'PM' : 'AM';

    this.pickuptime = `${hours}:${minutes} ${ampm}`;
    console.log(this.pickuptime);
  }



  startImageRotation() {
    this.interval = setInterval(() => {
      if (this.backgroundImageUrl.length > 0) {
        this.currentIndex = (this.currentIndex + 1) % this.backgroundImageUrl.length;
        this.changeBackgroundImage();
      }
    }, 4000);
  }
  getImageName(url: string): string {
    const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }

  changeBackgroundImage() {
    const bgElement = document.querySelector('.bg-img-hero');
    if (bgElement) {
      bgElement.classList.remove('active');
      setTimeout(() => {
        this.currentBackgroundImage = this.backgroundImageUrl[this.currentIndex];
        bgElement.classList.add('active');
      }, 100);
    }
  }

  increase() {
    this.persons++;
  }

  decrease() {
    if (this.persons <= 0) {
      this.persons = 0;
    } else {
      this.persons--;
    }
  }

  tabs = [

    { label: 'one way', section: 'section2' },
    { label: 'with return', section: 'section1' },
  ];
  activeSection = 'section2';

  setActiveSection(section: string) {

    this.activeSection = section;


    localStorage.setItem('activeSection', section);

  }

  seePrice() {
    if (!this.isLogin) {
      // this.dialogRef.close();
      this.toastr.info('Please login first ', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
      this.headerService.toggleDropdown();
      return;
    }

    if (this.fromId == undefined || this.toId == undefined) {
      this.toastr.info('Please choose the location first ', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
      return;
    }

    console.log(this.activeSection);

    if (this.activeSection === 'section2' && (this.date === undefined || this.pickuptime === undefined)) {
      this.toastr.info('Please enter date and time ', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
      return;
    }

    if (
      this.activeSection === 'section1' && (
        this.date === undefined ||
        this.pickuptime === undefined ||
        this.returnDate === undefined ||
        this.returnPickuptime === undefined)) {
      this.toastr.info('Please enter date and time ', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
      return;

    }

    else {
      let body: any = {
        from_id: this.fromId,
        to_id: this.toId,
        date: this.date,
        pickuptime: this.pickuptime,
        person: this.persons,
      };

      Object.keys(body).forEach(
        (k: any) => (body[k] === '' || body[k] === null) && delete body[k]
      );
      console.log(body);

      // Save the body object in localStorage


      localStorage.setItem('bookdetail', JSON.stringify(body));


      // Save the return date and return pickup time separately
      localStorage.setItem('returnDate', this.returnDate || '');
      localStorage.setItem('returnPickuptime', this.returnPickuptime || '');


      // Save the activeSection value separately
      const activeSectionValue = this.activeSection === 'section1' ? '2' : '1';


      localStorage.setItem('activeSection', activeSectionValue);


      // Make the HTTP request
      this.httpService.post(environment.marsa, 'transfer/get/car', body).subscribe({
        next: (res: any) => {
          console.log(res);

          // Store the response data in both the service and localStorage
          this.dataService.setResponseData(res);


          localStorage.setItem('responseData', JSON.stringify(res));


          // Navigate to the multi-step page
          this.router.navigate(
            ['/', this.translate.currentLang, 'transfer', 'multi-step'],

          );
        },
      });
    }
    // Construct the body object

  }

  onSelectFrom(event: any): void {
    const selectedId = event.target?.value;
    const selectedOption = this.transferDetails.hotel.find((option: { id: number; }) => option.id === +selectedId);

    if (selectedOption) {
      // Save both city and id into formData
      this.formData.fromCity = selectedOption.city;
      this.formData.fromId = selectedOption.id;
    }
  }
  onSelectTo(event: any): void {
    const selectedId = event.target?.value;
    const selectedOption = this.transferDetails.hotel.find((option: { id: number; }) => option.id === +selectedId);

    if (selectedOption) {
      // Save both city and id into formData
      this.formData.airport = selectedOption.name;
      this.formData.toId = selectedOption.id;
    }
  }
  onStarHover(starNumber: number) {
    this.selectedStar = starNumber;
  }

  onStarClick(starNumber: number) {
    this.starNumber = starNumber;
  }


  transferId: any;
  loadData(): void {
    this.transferId = 1;
  }
  
  addReview(): void {

    const model = {
      comment: this.comment,
      transfer_id: this.transferId,
      rating: this.starNumber,
    };
    if (!this.isLogin) {
      this.toastr.info('Please login first', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
      window.scroll(0, 0);
      this.headerService.toggleDropdown();
    } 
    if (this.starNumber !== null && this.starNumber !== 0 && this.comment !== null && this.comment !== '') {
      this.httpService.post(environment.marsa, 'Review/addreview', model).subscribe({
        next: (res: any) => {
          this.toastr.success(res.message);
          this.loadData();
          this.starNumber = null;
          this.comment = null;
          this.selectedStar = 0;
        },
      });
          } else if (this.starNumber === null || this.starNumber === 0 || this.comment === null || this.comment === '') {
            this.toastr.warning('Please specify the number of stars and write your comment before submitting! Thank you!', '', {
              disableTimeOut: false,
              titleClass: 'toastr_title',
              messageClass: 'toastr_message',
              timeOut: 5000,
              closeButton: true,
            });
          }
  }


  selectedOptionName: string | null = null;

  selectedFromName: string | null = null;

  availableToOptions: any[] = []; // This will hold the filtered options for the second dropdown

  filterFromOptions() {
    // Filter the airports based on the search term for "From"
    this.filteredFromAirports = this.transferDetails?.airports?.filter((airport: { name: string; }) =>
      airport.name.toLowerCase().includes(this.searchFrom.toLowerCase())
    );

    // Filter the hotels based on the search term for "From"
    this.filteredFromHotels = this.transferDetails?.hotel?.filter((hotel: { city: string; }) =>
      hotel.city.toLowerCase().includes(this.searchFrom.toLowerCase())
    );
  }

  filterToOptions() {
    // Filter the options (airports or hotels) in the second dropdown based on the search term for "To"
    this.filteredToOptions = this.availableToOptions?.filter(option =>
      (option.name || option.city).toLowerCase().includes(this.searchTo.toLowerCase())
    );
  }


  selectFromOption(option: any) {
    if (option.name) {
      // If an airport is selected
      this.selectedFromName = option.name;
      this.fromId = option.id;
      // Show hotels in the second dropdown
      this.availableToOptions = this.transferDetails?.hotel || [];

      // Store the word "airport" in local storage


      localStorage.setItem('selectedFromType', 'airport');

    } else if (option.city) {
      // If a hotel is selected
      this.selectedFromName = option.city;
      this.fromId = option.id;
      // Show airports in the second dropdown
      this.availableToOptions = this.transferDetails?.airports || [];

      // Store the word "hotel" in local storage (if needed)


      localStorage.setItem('selectedFromType', 'hotel');

    }
    // Reset the search and filtered options for the second dropdown
    this.searchTo = '';
    this.filterToOptions();
  }


  selectOption(option: any) {
    if (option.name) {
      this.selectedOptionName = option.name; // If an airport is selected
    } else if (option.city) {
      this.selectedOptionName = option.city; // If a hotel is selected
    }
    this.toId = option.id;
  }


  carouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    margin: 10,
    autoplay: false,
    navSpeed: 700,
    nav: true,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      1000: {
        items: 2
      }
    }
  };
  isExpanded: boolean = false;

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  carouselOptions2 = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,

    autoplay: true,
    navSpeed: 700,
    nav: false,
    items: 1, // Display one item per slide
    responsive: {
      0: {
        items: 2,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 2,
      }
    }
  };



}
