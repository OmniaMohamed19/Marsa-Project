import { Component, HostListener, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() background: string = '';
  selectedLang = '';
  showForm: boolean = true;
  isLogin: boolean = false;
  userDate: any;
  social: any;
  constructor(
    private _AuthService: AuthService,
    private langService: LanguageService,
    public translate: TranslateService,
    private headerService: HeaderService,
    private httpService: HttpService
  ) {
    this.langService.getCurrentLang().subscribe((lang) => {
      this.selectedLang = lang;
    });
  }
  ngOnInit(): void {
    this._AuthService.$isAuthenticated.subscribe((isAuth: any) => {
      this.isLogin = isAuth;
    });
    this._AuthService.getUserData().subscribe(
      (data: any) => {
        this.userDate = JSON.parse(data); // Assigning the received object directly
      },
      (error) => {
        // Handle error if needed
        console.error('Error:', error);
      }
    );
    this.headerService.toggleDropdown$.subscribe(() => {
      this.toggleDropdown();
    });

    this.httpService
      .get(environment.marsa, 'Background')
      .subscribe((res: any) => {
        this.social = res?.social;
      });
  }
  getImageName(url: string): string {
    const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }
  public languageOptions = [
    { value: 'en', label: 'English', flag: 'en.webp' },
    { value: 'rs', label: 'Русский', flag: 'rs.webp' },
    { value: 'cez', label: 'Čeština', flag: 'cez.webp' },
    { value: 'du', label: 'Deutsch', flag: 'du.webp' },
  ];
  registerBehavoiur: string = 'login';
  signClick: boolean = false;
  @HostListener('document:click', ['$event'])
  OnClickSignIn(event: any) {
    if (event.target.matches('.signUpDropdownInvoker')) {
      this.signClick = !this.signClick;
    }
  }
  toggleDropdown() {
    this.signClick = !this.signClick;
  }
  changeLang() {
    this.langService.setCurrentLang(this.selectedLang);
  }
  toggleLoginForm() {
    this.signClick = !this.signClick;
  }
  callLogout(): void {
    this._AuthService.logout();
  }

  call(option: any) {
    if (option == 'call') window.open('tel:' + this.social.Call, '_blank');
    else window.open('mailto:' + this.social.Mail, '_blank');
  }
}
