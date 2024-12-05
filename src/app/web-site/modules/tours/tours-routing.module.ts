import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingToursComponent } from './landing-tours/landing-tours.component';
import { ToursComponent } from './components/tours/tours.component';
import { ToursDetailsComponent } from './components/tours-details/tours-details.component';
import { CheckAvailpiltyComponent } from './components/check-availpilty/check-availpilty.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ConfirmPaymentComponent } from './components/confirm-payment/confirm-payment.component';

const routes: Routes = [
  {
    path: '',
    component: LandingToursComponent,
    children: [
      { path: '', redirectTo: 'allTours', pathMatch: 'full' },
      { path: 'allTours', component: ToursComponent },
      { path: 'details/:id/:name', component: ToursDetailsComponent },
      { path: ':id/:slug', component: ToursDetailsComponent },
      { path: 'check', component: CheckAvailpiltyComponent },
      //  { path: 'details/:slugUrl', component: ToursDetailsComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'confirm', component: ConfirmPaymentComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToursRoutingModule {}
