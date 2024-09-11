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

  ngOnInit() {
    // Retrieve responseData from localStorage
    const savedResponseData = localStorage.getItem('responseData');
    if (savedResponseData) {
      this.responseData = JSON.parse(savedResponseData);
      console.log('Retrieved response data:', this.responseData);
    } else {
      console.log('No response data found in localStorage');
    }
      console.log(this.responseData.car.option)
    // Load previously selected options (if any) from localStorage
    const savedSelectedOptions = localStorage.getItem('selectedOptions');
    if (savedSelectedOptions) {
      this.formData.selectedOptions = JSON.parse(savedSelectedOptions);
    }
  }

  // Called when an option is selected or deselected
  onOptionChange(option: any, event: any): void {
    if (event.target.checked) {
      // Add the selected option
      this.formData.selectedOptions[option.name] = option;
    } else {
      // Remove the deselected option
      delete this.formData.selectedOptions[option.name];
    }

    // Save the updated selected options to localStorage
    localStorage.setItem('selectedOptions', JSON.stringify(this.formData.selectedOptions));
  }

  // Emit the form data when moving to the next step
  nextStep(): void {
    localStorage.setItem('selectedOptions', JSON.stringify(this.formData.selectedOptions)); // Save selected options
    this.next.emit(this.formData); // Emit the formData to the next step
  }

  previousStep(): void {
    this.previous.emit();
  }
}
