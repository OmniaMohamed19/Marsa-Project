import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { LangValidatorGuard } from './core/guards/lang-validator.guard';
import { RobotsTxtGuard } from './core/guards/robots-txt-guard.guard';


const routes: Routes = [
  {
    path: ':lang',
    canActivate: [LangValidatorGuard],
    loadChildren: () =>
      import(`./web-site/web-site.module`).then((m) => m.WebSiteModule),
  },
  {
    path: '',
    redirectTo:
      localStorage.getItem('lang')! ? localStorage.getItem('lang')! : 'en',
    pathMatch: 'full',
  },

  { path: 'robots.txt', redirectTo: '/robots.txt' },


  { path: '**', component: NotFoundComponent },
];


@NgModule({
  imports: [    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', initialNavigation: 'enabledBlocking',onSameUrlNavigation: 'reload' }),],
  exports: [RouterModule]
})
export class AppRoutingModule { }
