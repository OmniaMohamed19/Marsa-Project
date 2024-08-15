import { NgModule,CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { TourDetailsRoutingModule } from './tour-details-routing.module';
import { MaindetailComponent } from './maindetail/maindetail.component';
import { CarouselModule } from 'primeng/carousel';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({

  declarations: [
    MaindetailComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    TourDetailsRoutingModule,
    SharedModule,
    CarouselModule,
    DropdownModule

  ]
})
export class TourDetailsModule { }
