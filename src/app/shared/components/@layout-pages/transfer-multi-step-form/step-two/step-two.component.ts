import { Component, EventEmitter, Output, OnInit } from '@angular/core';

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
  // savedSelectedOptions:any;
  savedSelectedOpti:any;

  ngOnInit() {
 
    const savedResponseData = localStorage.getItem('responseData');
    if (savedResponseData) {
      this.responseData = JSON.parse(savedResponseData);
    }

    const savedSelectedOptions = localStorage.getItem('selectedCar');
    if (savedSelectedOptions) {
      this.savedSelectedOpti = JSON.parse(savedSelectedOptions);
    } else {
      this.savedSelectedOpti = { option: [] }; 
    }

    this.formData.selectedOptions = {}; 
  }


  onOptionChange(option: any, event: any): void {
    if (event.target.checked) {
      this.formData.selectedOptions[option.name] = option;
    } else {
      delete this.formData.selectedOptions[option.name];
    }
    localStorage.setItem('selectedOptions', JSON.stringify(this.formData.selectedOptions));

  }

  nextStep(): void {
    localStorage.setItem('selectedOptions', JSON.stringify(this.formData.selectedOptions)); // Save selected options
    this.next.emit(this.formData); // Emit the formData to the next step
  }

  previousStep(): void {
    this.previous.emit();
  }
}
