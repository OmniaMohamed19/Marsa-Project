import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-step-four',
  templateUrl: './step-four.component.html',
  styleUrls: ['./step-four.component.scss']
})
export class StepFourComponent {
  @Output() submitForm = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  formData: any = {};
  tabs = [
    { section: 1, label: 'Customer information' },
    { section: 2, label: 'Optional items' },
    { section: 3, label: 'Payment information' },
    { section: 4, label: 'Booking is Confirmed' },
  ];
  constructor(

    private route: ActivatedRoute,
  ) { }
  activeSection: any;
  currentStep: any;
  submit(): void {
    this.submitForm.emit(this.formData);
  }
  setActiveSection(section: number): void {
    this.currentStep = section;
    this.activeSection = section;
  }

  previousStep(): void {
    this.previous.emit();
  }
  confirmRequest: any;
  relatedtrips: any[] = [];


  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      const res = JSON.parse(params['res']);
      this.confirmRequest = res;
    })
  }
}
