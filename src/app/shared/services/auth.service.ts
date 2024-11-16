import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  registerBehavoir: BehaviorSubject<string> = new BehaviorSubject<string>(
    'login'
  );
  userData: any;
  private token!: string;
  private $userData = new BehaviorSubject<any | null>(null);
  baseURL = environment.APIURL;
  private isAuthenticated = false;
  $isAuthenticated = new BehaviorSubject<boolean>(false);
  $loginError = new Subject();
  $changePassError = new Subject<any>();
  $profileUpdated = new Subject<any>();
  user: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(
    private _HttpClient: HttpClient,
    private router: Router,
    private httpservice: HttpService,
    private toastr: ToastrService,
    private transtale: TranslateService,
    private dialog: MatDialog
  ) {
    this.registerBehavoir = new BehaviorSubject<string>('login');
  }
  updateRegisterBehavoir(value: string): void {
    this.registerBehavoir.next(value);
  }
  getRegisterBehavoir() {
    return this.registerBehavoir.asObservable();
  }

  register(data: any) {
    return this.httpservice.post(environment.marsa, 'signup', data);
  }

  externalLogin(userData: { idToken: string; provider: string }) {
    this._HttpClient.post<any>(`${this.baseURL}Auth/external-login`, userData).subscribe({
      next: (res: any) => {

        if (res) {
          // set auth status and token
          this.$isAuthenticated.next(true);
          this.token = res.data.accessToken;
          localStorage.setItem('userToken', res.data.accessToken);
          // set user data
          localStorage.setItem('userData', JSON.stringify(res.data.userData));
          this.$userData.next(res.data.userData);
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([this.router.url]);
          });

        }
        else {
          this.$loginError.next(true);
        }
      },
      error: (err: any) => {
        this.$loginError.next(true);
        if (err.statusText == "Unauthorized") {
          this.toastr.error(this.transtale.instant("validation.Unauthorized"))
        }
        else
          this.toastr.error(err.message)
      },
    });
  }

  sendEmail(data: any) {
    return this.httpservice.post(
      environment.marsa,
      'password/forget_request',
      data
    );
  }
  confirmCode(data: any) {
    return this.httpservice.post(environment.marsa, 'confirmCode', data);
  }

  confirmReset(data: any) {
    return this.httpservice
      .post(environment.marsa, 'password/confirm_reset', data)
      .subscribe({
        next: (res: any) => {
          if (res) {
            if (!res.result) {
              this.toastr.error(res?.message);
            } else {
              // set auth status and token
              this.$isAuthenticated.next(true);
              this.token = res.access_token;
              localStorage.setItem('userToken', res.access_token);
              // set user data
              localStorage.setItem('userData', JSON.stringify(res.user));
              this.$userData.next(res.user);
              this.dialog?.closeAll();
              window.location.href =
                window.origin +
                '/' +
                localStorage.getItem('lang') +
                '/new-password';
            }
          } else {
            this.$loginError.next(true);
          }
        },
        error: (err: any) => {
          this.$loginError.next(true);
          if (err.statusText == 'Unauthorized') {
            this.toastr.error(
              this.transtale.instant('validation.Unauthorized')
            );
          } else this.toastr.error(err.message);
        },
      });
  }

  resendCode(data: any) {
    return this.httpservice.post(environment.marsa, 'resendCode', data);
  }

  authenticate(userData: { email: string; password: string }) {
    this._HttpClient.post<any>(`${this.baseURL}login`, userData).subscribe({
      next: (res: any) => {
        if (res) {
          // set auth status and token
          this.$isAuthenticated.next(true);
          this.token = res.access_token;
          localStorage.setItem('userToken', res.access_token);
          // set user data
          localStorage.setItem('userData', JSON.stringify(res.user));
          this.$userData.next(res.user);
          this.dialog?.closeAll();
          window.location.reload();
          // this.router.navigate([localStorage.getItem('lang')]);
        } else {
          this.$loginError.next(true);
        }
      },
      error: (err: any) => {
        this.$loginError.next(true);
        if (err.statusText == 'Unauthorized') {
          this.toastr.error(this.transtale.instant('validation.Unauthorized'));
        }
        // else this.toastr.error(err.message);
      },
    });
  }

  isLoginError(): Observable<boolean> {
    return this.$loginError as Observable<boolean>;
  }
  isChangePassError(): Observable<boolean> {
    return this.$changePassError as Observable<boolean>;
  }
  profileUpdated(): Observable<boolean> {
    return this.$profileUpdated as Observable<boolean>;
  }

  logout() {
    localStorage.removeItem('userToken');
    this.$isAuthenticated.next(false);
    this.token = '';
    localStorage.removeItem('userData');
    this.$userData.next(null);
    // this.router.navigate(['/']);
  }

  autoAuth() {
    const token = localStorage.getItem('userToken');
    if (token) {
      // Set authentication status only if token exists
      this.token = token;
      this.isAuthenticated = true;
      this.$isAuthenticated.next(true);
    } else {
      // If token doesn't exist (page refresh), reset authentication status
      this.isAuthenticated = false;
      this.$isAuthenticated.next(false);
    }
  }

  getToken() {
    if (localStorage.getItem('userToken')) {
      this.token = localStorage.getItem('userToken')!;
      return this.token;
    }
    return '';
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

  getUserData() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.$userData.next(userData);
    }
    return this.$userData as Observable<any>;
  }
  changeWebsiteUserSettings(formData: FormData) {
    this.httpservice
      .post<any>(environment.marsa, 'profile/update', formData)
      .subscribe({
        next: (res: any) => {
          this.$isAuthenticated.next(true);
          this.token = res.data.access_token;
          localStorage.setItem('userToken', res.data.access_token);

          localStorage.setItem('userData', JSON.stringify(res.data.user));
          this.$userData.next(res.data.user);
          this.$profileUpdated.next(true);

          // window.location.reload();
        },
        error: (err) => {
          this.$changePassError.next(true);
        },
      });
  }
}
