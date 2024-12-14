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
sitemap:string='';
robots:any;
  constructor(
    private langServ: LanguageService,
    private authService: AuthService,
    private seoService: SEOService,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    // ضبط اللغة الافتراضية
    if (typeof window !== 'undefined'){
      const lang = localStorage.getItem('lang');
      if (lang) {
        this.langServ.setCurrentLang(lang, true);
      } else {
        this.langServ.setCurrentLang('en', true);
      }
    }

    this.authService.autoAuth();
    this.seoService.getSEOData().subscribe((data) => {
      this.metaDetail = data?.seo;
      this.sitemap=this.metaDetail.sitemap;
      this.robots=this.metaDetail?.robots

      console.log(this.sitemap);
      console.log(this.robots);
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
