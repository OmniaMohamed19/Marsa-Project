import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { TourDetailsRoutingModule } from './tour-details-routing.module';
import { MaindetailComponent } from './maindetail/maindetail.component';


@NgModule({
  declarations: [
    MaindetailComponent,
  ],
  imports: [
    CommonModule,
    TourDetailsRoutingModule,
    SharedModule

  ]
})
export class TourDetailsModule { }
