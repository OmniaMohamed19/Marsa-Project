import { Component, HostListener, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
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
  userDetails: any;
  constructor(
    private _AuthService: AuthService,
    private langService: LanguageService,
    public translate: TranslateService,
    private headerService: HeaderService,
    private httpService: HttpService,
    private toastr: ToastrService,

  ) {
    this.langService.getCurrentLang().subscribe((lang) => {
      this.selectedLang = lang;
    });
  }
  ngOnInit(): void {
    this.httpService.get(environment.marsa, 'user/inform').subscribe((res: any) => {
      this.userDetails = res?.user_inform;

    });
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
//   showLoginMessage(): void {

//     // this.dialogRef.close();
//     this.toastr.info('Please login first ', '', {
//       disableTimeOut: false,
//       titleClass: 'toastr_title',
//       messageClass: 'toastr_message',
//       timeOut: 5000,
//       closeButton: true,
//     });
//     this.headerService.toggleDropdown();
//     return;

// }
  getImageName(url: string): string {
    const imageName = url?.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }
  // public languageOptions = [
  //   { value: 'en', label: 'English', flag: 'en.webp' },
  //   { value: 'rs', label: 'Русский', flag: 'rs.webp' },
  //   // { value: 'itl', label: 'Italian\u00A0\u00A0\u00A0', flag: 'itl.webp' },
  //   { value: 'cez', label: 'Čeština', flag: 'cez.webp' },
  //   // { value: 'fr', label: 'French\u00A0', flag: 'fr.webp' },
  //   { value: 'du', label:'Deutsch', flag: 'du.webp' },
  // ];
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
     window.open('mailto:' + this.social.Mail, '_blank');
  }
  contactWhatsapp() {
    window.open('https://api.whatsapp.com/send?phone=15551234567', '_blank');
  }
}
