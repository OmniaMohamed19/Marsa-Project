import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaindetailComponent } from './maindetail/maindetail.component';
import { ActivityditailComponent } from './activityditail/activityditail.component';

const routes: Routes = [

  {path:'',component:MaindetailComponent},
    {path:'trip/:typeid', component: ActivityditailComponent}

  // {path:'',component:MaindetailComponent,children:[
  //   {path:'trip/:typeid', component: ActivityditailComponent}
  // ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TourDetailsRoutingModule { }
