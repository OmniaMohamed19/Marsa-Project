import { Component, HostListener } from '@angular/core';
import { LanguageService } from './shared/services/language.service';
import { AuthService } from './shared/services/auth.service';
import { Meta, Title } from '@angular/platform-browser';
import { SEOService } from './shared/services/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
 // title = 'marsa-project';

  constructor(
    private langServ: LanguageService,
    private authService: AuthService,
    private seoService: SEOService,
    private meta: Meta,
    private title: Title
  ) { }

  ngOnInit(): void {
    const lang = localStorage.getItem('lang');
    if (lang) {
      this.langServ.setCurrentLang(lang, true);
    } else {
      this.langServ.setCurrentLang('en', true);
    }
    this.authService.autoAuth();



////////SEO///////
this.seoService.getSEOData().subscribe((data) => {
  console.log(data);
  this.title.setTitle(data.metatitle);

  this.meta.updateTag({ name: 'description', content: data.metadesc });

  this.meta.updateTag({ name: 'canonical', content: data.canonicalurl });

  // تحديث التاجز الأخرى مثل الـ robots و sitemap
  this.meta.updateTag({ name: 'robots', content: data.robots });
  this.meta.updateTag({ name: 'sitemap', content: data.sitemap });

  // يمكنك إضافة المزيد من التاجز بناءً على الـ SEO API
});
  }
  contactWhatsapp() {
    window.open('https://api.whatsapp.com/send?phone=15551234567', '_blank');
  }
  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any) {
  //   if (this.authService.getAuthStatus()) {
  //     this.authService.logout();
  //   }
  // }

}
