import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
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
  keyword: any = '';
  results: any = { trip: [] };
  showDropdown: boolean = false;
  userDetails: any;
  private isBrowser: boolean;

  constructor(
    public translate: TranslateService,
    private langService: LanguageService,
    private _AuthService: AuthService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private _HttpService: HttpService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.langService.getCurrentLang().subscribe((lang) => {
      this.selectedLang = lang;
    });
  }

  getImageName(url: string): string {
    if (!url) return 'Unknown photo';
    const imageName = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return imageName || 'Unknown photo';
  }

  onSearch(event?: any) {
    // If event is from focus, don't show error
    if (event?.type === 'focus') {
      if (this.keyword && this.keyword.trim()) {
        this.performSearch();
      }
      return;
    }

    // For enter key or button click
    if (!this.keyword || !this.keyword.trim()) {
      if (this.isBrowser) {
        Swal.fire('Error', 'Please enter a Keyword', 'error');
      }
      return;
    }

    this.performSearch();
  }

  private performSearch() {
    this._HttpService.post(environment.marsa, 'search/keyword', { keyword: this.keyword }).subscribe(
      (data) => {
        console.log('Search results:', data);
        this.results = data;
        this.showDropdown = this.results.trip && this.results.trip.length > 0;
      },
      (error) => {
        console.error('Search Error:', error);
      }
    );
  }

  navigateToRoute(route: string[]) {
    this.router.navigate(route);
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
    { value: 'du', label: 'Deutsch', flag: 'du.webp' },
    { value: 'rs', label: 'Русский', flag: 'rs.webp' },
    { value: 'cez', label: 'Čeština', flag: 'cez.webp' },
  ];

  changeLang() {
    this.langService.setCurrentLang(this.selectedLang);
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  isScrolled = false;

  @HostListener('window:scroll', [])
  checkScroll() {
    if (this.isBrowser) {
      this.isScrolled = window.scrollY > 100;
    }
  }

  countries = [
    {
      value: 'en',
      label: 'English',
      flagUrl: '../../../../../assets/images/flags/en.webp',
    },
    {
      value: 'du',
      label: 'Deutsch',
      flagUrl: '../../../../../assets/images/flags/du.webp',
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
  ];

  ngOnInit() {
    this._HttpService.get(environment.marsa, 'user/inform').subscribe((res: any) => {
      this.userDetails = res?.user_inform;
    });

    // Initialize selectedLabel with the first country's label
    if (this.countries.length > 0) {
      const initialCountry = this.countries.find(c => c.value === this.selectedLang) || this.countries[0];
      this.selectedLabel = initialCountry.label;
      this.selectedImg = initialCountry.flagUrl;
    }

    this._AuthService.$isAuthenticated.subscribe((isAuth: any) => {
      this.isLogin = isAuth;
    });

    this._AuthService.getUserData().subscribe(
      (data: any) => {
        if (data) {
          this.userDate = JSON.parse(data);
        }
      },
      (error) => {
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
    if (!this.isBrowser) return;

    const offcanvasElement = document.getElementById('staticBackdrop');
    const offcanvasBackdropElement = document.querySelector('.offcanvas-backdrop');

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
    this.isOpen = false;
  }

  openOffcanvas() {
    this.isOffCanvasOpen = true;
  }

  toggleOffcanvas() {
    this.isOffCanvasOpen = false;
  }

  // navigateToTrip(result: any) {
  //   console.log('Navigating to trip:', result);

  //   // Close dropdown and clear search
  //   this.showDropdown = false;
  //   this.keyword = '';

  //   // Simple navigation to tours page with search parameter
  //   const route = ['/', this.translate.currentLang, 'tours'];
  //   const queryParams = { search: result.Name };

  //   this.router.navigate(route, { queryParams }).then(success => {
  //     console.log('Navigation success:', success);
  //   }).catch(error => {
  //     console.error('Navigation error:', error);
  //   });
  // }
}


