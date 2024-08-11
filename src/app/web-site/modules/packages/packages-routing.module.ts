import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPackagesComponent } from './landing-packages/landing-packages.component';
import { AllPackagesComponent } from './components/all-packages/all-packages.component';
import { PackageDetailsComponent } from './components/package-details/package-details.component';
import { PackagePaymentComponent } from './components/package-payment/package-payment.component';
import { PackageConfirmComponent } from './components/package-confirm/package-confirm.component';

const routes: Routes = [
  {
    path: '', component: LandingPackagesComponent,
    children: [
      { path: 'allPackages', component: AllPackagesComponent},
      { path: 'packageDetails/:id', component: PackageDetailsComponent },
      { path: 'packagePayment', component: PackagePaymentComponent },
      { path: 'packageConfirm', component: PackageConfirmComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackagesRoutingModule { }
