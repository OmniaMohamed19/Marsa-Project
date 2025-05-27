import { NgModule, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule, Routes, Router, NavigationEnd } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
// import { LangValidatorGuard } from './core/guards/lang-validator.guard';
import { isPlatformBrowser } from '@angular/common';

const routes: Routes = [
  {
    path: ':lang',
    loadChildren: () =>
      import(`./web-site/web-site.module`).then((m) => m.WebSiteModule),
  },
  {
    path: '',
    redirectTo: 'en',
    pathMatch: 'full',
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabledBlocking',
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd && event.url === '/') {
          const storedLang = localStorage.getItem('lang');
          const redirectLang = storedLang || 'en';
          this.router.navigate([redirectLang]);
        }
      });
    }
  }
}
