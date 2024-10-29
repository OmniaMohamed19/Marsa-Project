import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { DataService } from '../../dataService';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from 'src/app/shared/services/header.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferComponent implements OnInit,AfterViewInit {
  formData: any = {};
  persons: number = 5;
  transferDetails: any;
  fromId: string = '';
  toId: any;
  date: string | null = null; // Initialize the date variable
  minDate: string;
  reviews:any;
  pickuptime:any;
  returnDate: any; // Add for return date
  returnPickuptime: any; // Add for return pickup time
  person: any;
  currentBackgroundImage: string = '';
  currentIndex: number = 0;
  interval: any;
  backgroundImageUrl: any = [];
  isLogin: boolean = false;
  comment: any;
  searchFrom: string = ''; // Holds the search term for the first dropdown (From)
searchTo: string = ''; // Holds the search term for the second dropdown (To)

filteredFromAirports: any[] = []; // Filtered airports for the first dropdown
filteredFromHotels: any[] = []; // Filtered hotels for the first dropdown
filteredToOptions: any[] = []; // Filtered options for the second dropdown
  constructor(
    private httpService: HttpService,
    private router: Router,
    private dataService: DataService,
    private translate: TranslateService,
    private headerService: HeaderService,
    private _AuthService: AuthService,
    private toastr: ToastrService,
  ) { const today = new Date();
    this.minDate = today.toISOString().split('T')[0];}

    ngAfterViewInit(): void {
      const pickerInline = document.querySelector('.timepicker-inline-12');
      const timepickerMaxMin = new (window as any).mdb.Timepicker(pickerInline, {
        format12: true,
        inline: true
      });
    }
  ngOnInit(): void {
    this.filteredFromAirports = this.transferDetails?.airports || [];
    this.filteredFromHotels = this.transferDetails?.hotel || [];
    this.filteredToOptions = [];
    this._AuthService.$isAuthenticated.subscribe((isAuth: any) => {
      this.isLogin = isAuth;
    });
    this.httpService.get(environment.marsa, 'Background').subscribe(
      (res: any) => {
        this.backgroundImageUrl = res?.transfer || [];
        console.log(this.backgroundImageUrl);
        if (this.backgroundImageUrl.length > 0) {
          this.currentBackgroundImage = this.backgroundImageUrl[0];
        }
      },
      (err) => {}
    );

    this.httpService.get(environment.marsa, 'transfer').subscribe({
      next: (res: any) => {
        this.transferDetails = res;
        if (this.transferDetails?.reviwe) {
          this.reviews = Object.values(this.transferDetails.reviwe);
        }
        console.log(res);
      },
      error: (err) => {
        console.error('Error fetching transfer details', err);
      }
    });

    // Retrieve and set the saved values if any
    this.returnDate = localStorage.getItem('returnDate') || '';
    this.returnPickuptime = localStorage.getItem('returnPickuptime') || '';
    console.log('Retrieved returnDate:', this.returnDate);
    console.log('Retrieved returnPickuptime:', this.returnPickuptime);
  }
  startImageRotation() {
    this.interval = setInterval(() => {
      if (this.backgroundImageUrl.length > 0) {
        this.currentIndex = (this.currentIndex + 1) % this.backgroundImageUrl.length;
        this.changeBackgroundImage();
      }
    }, 4000); // تغيير الصورة كل 4 ثوانٍ
  }

  changeBackgroundImage() {
    const bgElement = document.querySelector('.bg-img-hero');
    if (bgElement) {
      bgElement.classList.remove('active'); // إزالة الكلاس active
      setTimeout(() => {
        this.currentBackgroundImage = this.backgroundImageUrl[this.currentIndex]; // تغيير الصورة
        bgElement.classList.add('active'); // إضافة الكلاس active بعد التغيير
      }, 100); // الانتظار 100 مللي ثانية قبل إضافة الكلاس
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
    { label: 'with return', section: 'section1' },
    { label: 'one way', section: 'section2' },
  ];
  activeSection = 'section1';

  setActiveSection(section: string) {
  
    this.activeSection = section;
    localStorage.setItem('activeSection', section);
  }

  seePrice() {
    // Construct the body object
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
          ['/', this.translate.currentLang, 'transfer','multi-step'],

        );
      },
    });
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

  addReview(): void {
    const model = {

      comment: this.comment,
      transfer_id:1,
      rating:3,
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
    } else {
      this.httpService
        .post(environment.marsa, 'Review/addreview', model)
        .subscribe({
          next: (res: any) => {
            this.toastr.success(res.message);
            // this.loadData();
            // this.starNumber = 0;
            this.comment = '';
            // this.selectedStar = 0;
          },
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
    dots: true,
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
