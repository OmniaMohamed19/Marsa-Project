import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss']
})
export class StepThreeComponent {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();

  selected:boolean = true;
  formData: any = {};

  nextStep(): void {
    this.next.emit(this.formData);
  }

  previousStep(): void {
    this.previous.emit();
  }

  toggleSelected(): void {
    this.selected = !this.selected;
  }
}
