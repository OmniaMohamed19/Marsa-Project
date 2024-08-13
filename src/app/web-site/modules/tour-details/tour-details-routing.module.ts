import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaindetailComponent } from './maindetail/maindetail.component';
import { ActivityditailComponent } from './activityditail/activityditail.component';

const routes: Routes = [
  {path:'',component:MaindetailComponent},
  { path: 'trip/:id', component: ActivityditailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TourDetailsRoutingModule { }
