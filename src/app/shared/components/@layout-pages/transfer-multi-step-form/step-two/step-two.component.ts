import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

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
  savedSelectedOpti: any;
  numberOfOption: any;

  constructor(private toastr: ToastrService) {}

  ngOnInit() {
    const savedResponseData = localStorage.getItem('responseData');
    if (savedResponseData) {
      this.responseData = JSON.parse(savedResponseData);
    }

    const savedSelectedOptions = localStorage.getItem('selectedCar');
    if (savedSelectedOptions) {
      this.savedSelectedOpti = JSON.parse(savedSelectedOptions);
      // أضف الحقل `number` إذا لم يكن موجودًا
      this.savedSelectedOpti.option.forEach((opt: any) => {
        opt.number = opt.number || 0; // التأكد من وجود الحقل `number`
      });
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

  savenumberOfOption(option: any): void {
    option.number = Math.max(0, option.number || 0);
    localStorage.setItem('numberOption', this.numberOfOption.toString()); // Save input value to localStorage
  }

  nextStep(): void {
    if (Object.keys(this.formData.selectedOptions).length > 0 && (!this.numberOfOption || this.numberOfOption <= 0)) {
      this.toastr.info('Please enter a valid number for the selected option! ', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
      return;
    }

    localStorage.setItem('selectedOptions', JSON.stringify(this.formData.selectedOptions)); // Save selected options
    this.next.emit(this.formData);
    window.scrollTo(0, 0);
  }

  previousStep(): void {
    this.previous.emit();
  }
}
