import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingTransferComponent } from './landing-transfer/landing-transfer.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { MultiStepComponent } from './components/multi-step/multi-step.component';

const routes: Routes = [
  {
    path: '', component: LandingTransferComponent,
    children: [
      { path: '', redirectTo: "allTransfers", pathMatch: 'full' },
      //here your components on folder components
      { path: 'allTransfers', component: TransferComponent},
      { path: 'multi-step', component: MultiStepComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferRoutingModule { }
