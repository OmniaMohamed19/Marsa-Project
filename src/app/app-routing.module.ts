import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: ':lang',
    loadChildren: () => import(`./web-site/web-site.module`).then(m => m.WebSiteModule)
  },
  // {path:'',
  // loadChildren: () => import(`./pages/pages.module`).then(m => m.PagesModule)
  // },
  // {path: '**', redirectTo: '/404/not-found'},
  {
    path: '',
    redirectTo:
    localStorage.getItem('lang')!
      ? localStorage.getItem('lang')!
      : 'en',
    pathMatch: 'full',
  },

];

@NgModule({
  imports: [    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', initialNavigation: 'enabledBlocking',onSameUrlNavigation: 'reload' }),],
  exports: [RouterModule]
})
export class AppRoutingModule { }
