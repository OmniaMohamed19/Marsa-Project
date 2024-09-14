import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/web-site/modules/transfer/dataService';

@Component({
  selector: 'app-multi-step-form',
  templateUrl: './multi-step-form.component.html',
  styleUrls: ['./multi-step-form.component.scss'],
})
export class MultiStepFormComponent {
  currentStep: number = 1;
  formData: any = {}; // To store the data from all steps
  activeSection: number = 1; // Active section corresponds to the current step
  responseData: any;
  constructor(private dataService: DataService,private route: ActivatedRoute) {}
  tabs = [
    { section: 1, label: 'Customer information' },
    { section: 2, label: 'Optional items' },
    { section: 3, label: 'Payment information' },
    { section: 4, label: 'Booking is Confirmed' },
  ];
  ngOnInit(): void {
    // Retrieve the data from the service
    this.responseData = this.dataService.getResponseData();
    console.log(this.responseData); // Use the data as needed

    // Check queryParams to set current step
    this.route.queryParams.subscribe((params) => {
      const step = +params['step']; // Convert 'step' to a number
      if (step && step >= 1 && step <= 4) {
        this.currentStep = step;
        this.activeSection = step;
      }
    });
  }

  setActiveSection(section: number): void {
    this.currentStep = section;
    this.activeSection = section;
  }
  /***********************/
  goToNextStep(data: any): void {
    this.formData = { ...this.formData, ...data };
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  goToPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submitForm(data: any): void {
    this.formData = { ...this.formData, ...data };
    console.log('Form Data:', this.formData);
    // Handle form submission
  }

}
