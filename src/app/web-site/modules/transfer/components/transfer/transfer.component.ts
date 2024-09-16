import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { DataService } from '../../dataService';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
})
export class TransferComponent implements OnInit {
  formData: any = {};
  persons: number = 5;
  transferDetails: any;
  fromId: string = '';
  toId: any;
  date: any;
  pickuptime: any;
  returnDate: any; // Add for return date
  returnPickuptime: any; // Add for return pickup time
  person: any;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private dataService: DataService,
    private translate: TranslateService,

  ) {}

  ngOnInit(): void {
    this.httpService.get(environment.marsa, 'transfer').subscribe({
      next: (res: any) => {
        this.transferDetails = res;
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

    if (section === 'section1') {
      localStorage.setItem('activeSection', '2');
    } else if (section === 'section2') {
      localStorage.setItem('activeSection', '1');
    }
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
    const selectedId = event.target.value;
    const selectedOption = this.transferDetails.hotel.find((option: { id: number; }) => option.id === +selectedId);

    if (selectedOption) {
      // Save both city and id into formData
      this.formData.fromCity = selectedOption.city;
      this.formData.fromId = selectedOption.id;
    }
  }
  onSelectTo(event: any): void {
    const selectedId = event.target.value;
    const selectedOption = this.transferDetails.hotel.find((option: { id: number; }) => option.id === +selectedId);

    if (selectedOption) {
      // Save both city and id into formData
      this.formData.airport = selectedOption.name;
      this.formData.toId = selectedOption.id;
    }
  }



}
