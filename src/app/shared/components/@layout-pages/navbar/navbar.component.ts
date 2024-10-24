import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LanguageService } from 'src/app/shared/services/language.service';
import { LoginComponent } from '../Auth/login/login.component';
import { HostListener } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpService } from 'src/app/core/services/http/http.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Input() background: string = '';
  @Input() isWhiteByDefault: boolean = true;
  selectedLang = '';
  isLogin: boolean = false;
  isOpen = false;
  selectedLabel!: string;
  selectedImg!: string;
  isOffCanvasOpen = false;
  showSearch: boolean = false;
  userDate: any;
  keyword:any;
  results: any= [];
  showDropdown: boolean = false;
  constructor(
    public translate: TranslateService,
    private langService: LanguageService,
    private _AuthService: AuthService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private _HttpService: HttpService,
  ) {
    this.langService.getCurrentLang().subscribe((lang) => {
      this.selectedLang = lang;
    });
  }


  onSearch() {
    if (this.keyword.trim()) {
      this._HttpService.post(environment.marsa, 'search/keyword', { keyword: this.keyword }).subscribe(
        (data) => {
          console.log('Search Results:', data);
          this.results = data;
          this.showDropdown = this.results.trip.length > 0;
        },
        (error) => {
          console.error('Error:', error);
        }
      );
    } else {
      Swal.fire('Error', 'Please enter a Keyword', 'error');
    }
  }
  navigateTo(link: string) {
    window.location.href = link;
  }

  hideDropdown() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }
  search(input: HTMLInputElement) {
    const currentLang = this.translate.currentLang;
    const queryParams = { search: input.value, page: 1 };
  }

  public languageOptions = [
    { value: 'en', label: 'English', flag: 'en.webp' },
    { value: 'rs', label: 'Русский', flag: 'rs.webp' },
    { value: 'cez', label: 'Čeština', flag: 'cez.webp' },
    { value: 'du', label: 'Deutsch', flag: 'du.webp' },
  ];
  changeLang() {
    this.langService.setCurrentLang(this.selectedLang);
  }
  /******************************/

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }
  /************To make scroll event******************** */
  isScrolled = false;

  @HostListener('window:scroll', [])
  checkScroll() {
    this.isScrolled = window.scrollY > 100;
  }
  /************************************* */
  countries = [
    {
      value: 'en',
      label: 'English',
      flagUrl: '../../../../../assets/images/flags/en.webp',
    },
    {
      value: 'rs',
      label: 'Русский',
      flagUrl: '../../../../../assets/images/flags/rs.webp',
    },
    {
      value: 'cez',
      label: 'Čeština',
      flagUrl: '../../../../../assets/images/flags/cez.webp',
    },
    {
      value: 'du',
      label: 'Deutsch',
      flagUrl: '../../../../../assets/images/flags/du.webp',
    },
    // Add more countries as needed
  ];

  ngOnInit() {
    // Initialize selectedLabel with the first country's label
    if (this.countries.length > 0) {
      this.selectedLabel = this.countries[0].label;
      this.selectedImg = this.countries[0].flagUrl;
    }

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
  }
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  callLogout(): void {
    this._AuthService.logout();
  }



  closeOffcanvas() {
    const offcanvasElement = document.getElementById('staticBackdrop');
    const offcanvasBackdropElement = document.querySelector(
      '.offcanvas-backdrop'
    );

    if (offcanvasElement) {
      offcanvasElement.classList.remove('show');
    }

    if (offcanvasBackdropElement) {
      offcanvasBackdropElement.classList.remove('show');
    }

    if (offcanvasBackdropElement && offcanvasBackdropElement.parentNode) {
      offcanvasBackdropElement.parentNode.removeChild(offcanvasBackdropElement);
    }
    this.dialog.open(LoginComponent, {
      width: '100%',
      maxHeight: '80vh',
    });
  }

  signIn() {
    this.closeOffcanvas();
  }

  selectCountry(country: any) {
    this.selectedLabel = country.label;
    this.selectedImg = country.flagUrl;
    this.langService.setCurrentLang(country.value);
    this.isOpen = true;
  }
  /**********************************************/
  openOffcanvas() {
    this.isOffCanvasOpen = true;
  }
  toggleOffcanvas() {
    this.isOffCanvasOpen = false;
  }

  // closeOffcanvas(event: MouseEvent) {
  //   if ((event.target as HTMLElement).classList.contains('offcanvas-content')) {
  //     this.isOffCanvasOpen = false;
  //   }
  // }
}
