import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-boat-slider-modal',
  templateUrl: './boat-slider-modal.component.html',
  styleUrls: ['./boat-slider-modal.component.scss'],
})
export class BoatSliderModalComponent {
  @Input() images: any[] = [];
  imagesOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    autoplay: true,
    margin: 25,
    navSpeed: 700,
    navText: [
      "<i class='fa fa-angle-left'></i>",
      "<i class='fa fa-angle-right'></i>",
    ],
    responsive: {
      0: {
        items: 1,
      },
      720: {
        items: 1,
      },
      1200: {
        items: 1,
      },
    },
    nav: true,
  };
  constructor(
    public dialogRef: MatDialogRef<BoatSliderModalComponent>,
    @Inject(MAT_DIALOG_DATA) public imageData: any
  ) {}

  closeModal(): void {
    this.dialogRef.close(); // Close the modal
  }
}
