import { Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})
export class StepTwoComponent {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  formData: any = {};

  nextStep(): void {
    this.next.emit(this.formData);
  }

  previousStep(): void {
    this.previous.emit();
  }
}
