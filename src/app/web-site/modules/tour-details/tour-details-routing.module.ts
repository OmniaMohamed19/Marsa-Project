import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaindetailComponent } from './maindetail/maindetail.component';

const routes: Routes = [

  {path:'',component:MaindetailComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TourDetailsRoutingModule { }
