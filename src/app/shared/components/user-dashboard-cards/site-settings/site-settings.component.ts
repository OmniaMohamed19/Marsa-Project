import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-site-settings',
  templateUrl: './site-settings.component.html',
  styleUrls: ['./site-settings.component.scss']
})
export class SiteSettingsComponent implements OnInit{
  /**************************/
  isOpenDrop = false;
  selectedLabelCountry!: string;
  selectedImgCountry!: string;
  countries1 = [
    { label: 'Egypt', flagUrl: '../../../../../assets/images/flags/eg-circle.png' },
    { label: 'Germany', flagUrl: '../../../../../assets/images/flags/eg-circle.png' }
    // Add more countries as needed
  ];

  toggleDropdownCountry() {
    this.isOpenDrop = !this.isOpenDrop;
  }

  selectCountryflag(country: any) {
    this.selectedLabelCountry = country.label;
    this.selectedImgCountry = country.flagUrl;
    this.isOpenDrop = true;
  }
  getImageName(url: string): string {
    const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }

   /**************************/
   isOpenCurrancy = false;
   selectedLabelCurrancy!: string;
   selectedImgCurrancy!: string;
   countries2 = [
     { label: '$ - USA', flagUrl: '../../../../../assets/images/flags/eg-circle.png' },
     { label: 'Germany', flagUrl: '../../../../../assets/images/flags/eg-circle.png' }
     // Add more countries as needed
   ];

   toggleDropdownCurrancy() {
     this.isOpenCurrancy = !this.isOpenCurrancy;
   }

   selectCurrancyflag(country: any) {
     this.selectedLabelCurrancy = country.label;
     this.selectedImgCurrancy = country.flagUrl;
     this.isOpenCurrancy = true;
   }
  /************************ */
  ngOnInit(): void {
    if (this.countries1.length > 0) {
      this.selectedLabelCountry = this.countries1[0].label;
      this.selectedImgCountry = this.countries1[0].flagUrl;
    }
    if (this.countries2.length > 0) {
      this.selectedLabelCurrancy = this.countries2[0].label;
      this.selectedImgCurrancy = this.countries2[0].flagUrl;
    }
  }
}
