import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // @Input() background: string = '';
  selectedLang = '';
  showForm: boolean = true;
  isLogin: boolean = false;
  social: any;
  userDate: any;
  placesInput: any = [];
  coverImage: any = '';
  constructor(
    private _AuthService: AuthService,
    private langService: LanguageService,
    public translate: TranslateService,
    private httpService: HttpService
  ) {
    this.langService.getCurrentLang().subscribe((lang) => {
      this.selectedLang = lang;
    });
    this.httpService.get(environment.marsa, 'Background').subscribe(
      (res: any) => {
        this.coverImage = res?.homecover[0];
        this.social = res?.social;
      },
      (err) => {}
    );
  }
  ngOnInit(): void {
    this._AuthService.$isAuthenticated.subscribe((isAuth: any) => {
      this.isLogin = isAuth;
    });
    this._AuthService.getUserData().subscribe(
      (data: any) => {
        this.userDate = JSON.parse(data); // Assigning the received object directly
        this.httpService.get('marsa', 'place').subscribe({
          next: (res: any) => {
            this.placesInput = res.places;
          },
        });
      },
      (error) => {
        // Handle error if needed
        console.error('Error:', error);
      }
    );
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
  hidesectionfun: boolean = true;
  hidesection() {
    this.hidesectionfun = false;
  }

  contactWhatsapp() {
    window.open('https://api.whatsapp.com/send?phone=15551234567', '_blank');
  }

  call(option: any) {
    if (option == 'call') window.open('tel:' + this.social.Call, '_blank');
    else window.open('mailto:' + this.social.Mail, '_blank');
  }
}
