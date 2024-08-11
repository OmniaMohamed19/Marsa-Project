import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSliderModalComponent } from './image-slider-modal.component';

describe('ImageSliderModalComponent', () => {
  let component: ImageSliderModalComponent;
  let fixture: ComponentFixture<ImageSliderModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageSliderModalComponent]
    });
    fixture = TestBed.createComponent(ImageSliderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
