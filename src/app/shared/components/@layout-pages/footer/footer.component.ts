import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoginComponent } from '../Auth/login/login.component';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  log: boolean = false;
  reg: boolean = false;
  isAdmin: boolean = false;
  setting: any = [];
  flagJoin: boolean = false;
  joinInForm!: FormGroup;
  isLogin: boolean = false;
  social: any;
  showScrollToTopButton: boolean = false;
  constructor(
    private fb: FormBuilder,
    private _AuthService: AuthService,
    private dialog: MatDialog,
    private httpService: HttpService
  ) {}
  ngOnInit(): void {
    this.joinInForm = this.fb.group({
      email: [''],
    });
    this._AuthService.$isAuthenticated.subscribe((isAuth: any) => {
      this.isLogin = isAuth;
    });
    this.httpService
      .get(environment.marsa, 'Background')
      .subscribe((res: any) => {
        this.social = res?.social;
      });
  }
  change() {}
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Check if user has scrolled down
    this.showScrollToTopButton = window.scrollY > 400; // Adjust the scroll position as needed
  }

  signup() {
    this.dialog.open(LoginComponent, {
      width: '100%',
      maxHeight: '80vh',
    });
  }
}
