import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaindetailComponent } from './maindetail/maindetail.component';
import { ActivityditailComponent } from './activityditail/activityditail.component';

const routes: Routes = [
  {path:'',component:ActivityditailComponent,children:[
    // {path:'',redirectTo:'search',pathMatch:'full'},
    {path:'',component:MaindetailComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TourDetailsRoutingModule { }
