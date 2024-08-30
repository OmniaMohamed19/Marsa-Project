import { Component, HostListener } from '@angular/core';
import { LanguageService } from './shared/services/language.service';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'marsa-project';

  constructor(
    private langServ: LanguageService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const lang = localStorage.getItem('lang');
    if (lang) {
      this.langServ.setCurrentLang(lang, true);
    } else {
      this.langServ.setCurrentLang('en', true);
    }
    this.authService.autoAuth();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.authService.getAuthStatus()) {
      // تسجيل الخروج عند إغلاق المتصفح
      this.authService.logout();
    }
  }
}
