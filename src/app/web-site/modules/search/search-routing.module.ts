import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingSearchComponent } from './landing-search/landing-search/landing-search.component';
import { SearchComponent } from './components/search/search.component';

const routes: Routes = [
  {path:'',component:LandingSearchComponent,children:[
    // {path:'',redirectTo:'search',pathMatch:'full'},
    {path:'',component:SearchComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
