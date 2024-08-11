import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit{
  @Output() next = new EventEmitter<any>();
  formData: any = {};
  activeSection = 'section1';
  nextStep(): void {
    this.next.emit(this.formData);
  }
  /*****************************/
  persons : number = 0;
  increase(){
    this.persons++
  }
  decrease(){
    if(this.persons <= 0){
      this.persons =0 
    }else{
      this.persons--
    }
    
  }

  /***************************/
  isOpen = false;
  selectedLabel!: string;  
  selectedImg!: string;  
  countries = [
    { label: '+20', flagUrl: '../../../../../assets/images/flags/eg.png' },
    { label: '+1', flagUrl: '../../../../../assets/images/flags/du.webp' }
    // Add more countries as needed
  ];

  ngOnInit() {
    // Initialize selectedLabel with the first country's label
    if (this.countries.length > 0) {
      this.selectedLabel = this.countries[0].label;
      this.selectedImg = this.countries[0].flagUrl;
    }
    if (this.countries.length > 0) {
    
      this.selectedLabel = this.countries[0].label;
      this.selectedImg = this.countries[0].flagUrl;
    }
  }
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectCountry(country: any) {
    this.selectedLabel = country.label;
    this.selectedImg = country.flagUrl;
    this.isOpen = true;
  }
}
