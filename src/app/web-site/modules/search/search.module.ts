import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { LandingSearchComponent } from './landing-search/landing-search/landing-search.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchComponent } from './components/search/search.component';


@NgModule({
  declarations: [
    LandingSearchComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    SharedModule
  ]
})
export class SearchModule { }
