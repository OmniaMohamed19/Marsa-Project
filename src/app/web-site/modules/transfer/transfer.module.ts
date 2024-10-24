import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransferRoutingModule } from './transfer-routing.module';
import { LandingTransferComponent } from './landing-transfer/landing-transfer.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MultiStepComponent } from './components/multi-step/multi-step.component';


@NgModule({
  declarations: [
    LandingTransferComponent,
    TransferComponent,
    MultiStepComponent
  ],
  imports: [
    CommonModule,
    TransferRoutingModule,
    SharedModule,


  ],
 
})
export class TransferModule { }
