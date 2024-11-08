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
 metaDetail:any;
  constructor(
    private langServ: LanguageService,
    private authService: AuthService,
    private seoService: SEOService,
    private titleService: Title, private metaService: Meta
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
  console.log(data.seo);

  // this.title.setTitle(seo.metatitle);

  // this.meta.updateTag({ name: 'description', content: seo.metadesc });

  // this.meta.updateTag({ name: 'canonical', content: seo.canonicalurl });

  // this.meta.updateTag({ name: 'robots', content: seo.robots });
  // this.meta.updateTag({ name: 'sitemap', content: seo.sitemap });


 // Set the page title
 this.metaDetail=data?.seo;
 this.titleService.setTitle(this.metaDetail?.metatitle);
//  console.log(seo.metatitle);

 // Set meta tags
 this.metaService.addTags([
   { name: 'description', content: this.metaDetail.metadesc },
   { name: 'slugUrl', content: this.metaDetail.slugUrl},
   { name: 'robots', content: this.metaDetail.robots },
   { name: 'sitemap', content: this.metaDetail.sitemap },
   { name: 'canonical', content: this.metaDetail.canonicalurl },
  //  { property: 'og:title', content: 'Your Open Graph Title' },
  //  { property: 'og:description', content: 'Description for social media' },
  //  { property: 'og:image', content: 'URL-to-your-image.jpg' }
 ]);
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
