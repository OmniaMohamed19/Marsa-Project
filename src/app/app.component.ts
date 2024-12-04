import { Component, OnInit } from '@angular/core';
import { LanguageService } from './shared/services/language.service';
import { AuthService } from './shared/services/auth.service';
import { Meta, Title } from '@angular/platform-browser';
import { SEOService } from './shared/services/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  metaDetail: any;

  constructor(
    private langServ: LanguageService,
    private authService: AuthService,
    private seoService: SEOService,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {

      const lang = localStorage.getItem('lang');
      if (lang) {
        this.langServ.setCurrentLang(lang, true);
      } else {
        this.langServ.setCurrentLang('en', true);
      }
    


    this.authService.autoAuth();

    // استدعاء بيانات الـ SEO من الباك اند
    this.seoService.getSEOData().subscribe((data) => {
      this.metaDetail = data?.seo;

      if (this.metaDetail) {
        this.titleService.setTitle(this.metaDetail?.metatitle);

        this.metaService.addTags([
          { name: 'description', content: this.metaDetail?.metadesc },
           { name: 'slugURL', content: this.metaDetail?.slugUrl }
        ]);

        // تحديث الـ slugURL
        const slugURL = this.metaDetail?.slugUrl;
        if (slugURL) {
          window.history.replaceState({}, '', slugURL);
        }

        const canonicalURL = this.metaDetail?.canonicalurl;
        if (canonicalURL) {
          this.seoService.setCanonicalURL(canonicalURL);
        }
        const robots = this.metaDetail?.robots;

        if (robots) {
          this.seoService.setRobotsURL(robots);
        }
        const sitemap = this.metaDetail?.sitemap;

        if (sitemap) {
        // استخدم الرابط الخاص بـ sitemap.xml
        this.seoService.setSitemapURL(sitemap);
      }

      }
    });
  }
  imageUrl: string = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/WhatsApp_icon.png/479px-WhatsApp_icon.png';

  // دالة لاستخراج اسم الصورة
  getImageName(url: string): string {
    // الحصول على اسم الصورة من الرابط
    const imageName = url.substring(url.lastIndexOf('/') + 1, url.indexOf('.'));
    return imageName; // مثل "WhatsApp_icon"
  }

  contactWhatsapp() {
    window.open('https://api.whatsapp.com/send?phone=15551234567', '_blank');
  }
}
