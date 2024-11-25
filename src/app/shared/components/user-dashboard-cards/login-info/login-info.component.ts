import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-login-info',
  templateUrl: './login-info.component.html',
  styleUrls: ['./login-info.component.scss'],
})
export class LoginInfoComponent {
  /********************************/
  @Input() userDetails: any;
  isOpen = false;
  selectedLabel!: any;
  selectedImg!: any;
  countries = [
    { label: '+20', flagUrl: '../../../../../assets/images/flags/eg.png' },
    { label: '+1', flagUrl: '../../../../../assets/images/flags/du.webp' },
    // Add more countries as needed
  ];

  ngOnInit() {
    // Initialize selectedLabel with the first country's label
    if (this.countries.length > 0) {
      let selectedCountry = this.countries.find((item: any) => {
        return item.label == '+' + this.userDetails?.overviwe?.countrycode;
      });
      this.selectedLabel = selectedCountry?.label;
      this.selectedImg = selectedCountry?.flagUrl;
    }
  }
  getImageName(url: string): string {
    const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectCountry(country: any) {
    this.selectedLabel = country.label;
    this.selectedImg = country.flagUrl;
    this.isOpen = false;
  }
  /*******************************/
}
