import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLang: BehaviorSubject<string>;

  constructor(
    private translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.currentLang = new BehaviorSubject<string>('en');
    // route.params.subscribe((params) => {
    // });
  }

  setCurrentLang(language: string, init: boolean = false) {
    if (language === 'rs' || language === 'en' || language === 'du' || language === 'cez') {
      let htmlTag = this.document.getElementsByTagName(
        'html'
      )[0] as HTMLHtmlElement;
      htmlTag.dir = language === 'en' ? 'ltr' : 'ltr';
      htmlTag.lang = language;
      this.translateService.use(language);
      if (typeof window !== 'undefined' && window.localStorage){

        localStorage.setItem('lang', language);
      }
      this.currentLang.next(language);

      /// Get the current URL segments
      const currentUrlSegments = this.router.url.split('/');
      currentUrlSegments[1] = language;
      // Construct the new URL and navigate to it
      const newUrl = currentUrlSegments.join('/');

      if (!init) {
        this.router.navigateByUrl(newUrl).then(() => {
          window.location.reload();
        })
      }

    } else {
      this.setCurrentLang('en');
    }

  }

  getCurrentLang() {
    return this.currentLang.asObservable();
  }
}
