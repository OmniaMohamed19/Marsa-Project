import { Component, EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'app-step-four',
  templateUrl: './step-four.component.html',
  styleUrls: ['./step-four.component.scss']
})
export class StepFourComponent {
  @Output() submitForm = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  formData: any = {};

  submit(): void {
    this.submitForm.emit(this.formData);
  }

  previousStep(): void {
    this.previous.emit();
  }
}
