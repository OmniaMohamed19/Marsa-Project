import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  emailPattern!: string;
  showForm: boolean = false;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  showRegisterComponent = false;
  isPasswordVisible = false;
  showResetComponent = false;
  showCodeSignForm=false;
  baseURL = environment.APIURL;
   private isAuthenticated = false;
    $isAuthenticated = new BehaviorSubject<boolean>(false);
    private token!: string;
    private $userData = new BehaviorSubject<any | null>(null);
    $loginError = new Subject();

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private transtale: TranslateService,
    private _HttpClient: HttpClient,
  ) { }

  ngOnInit(): void {
    // إنشاء النموذج
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      rememberMe: new FormControl(false),
      showForm: new FormControl(true),
    });

    this.authService.registerBehavoir.subscribe((behavior: string) => {
      this.showRegisterComponent = behavior === 'signup';
    });
  }

  toggleVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  changeReqister(value: string) {
    if (value === 'signup') {
      this.showRegisterComponent = true;
      this.loginForm.get('showForm')?.setValue(false);
    } else if (value == 'reset') {
      this.showResetComponent = true;
      this.loginForm.get('showForm')?.setValue(false);
    }
     else if (value == 'otp') {
      this.showCodeSignForm=true;
      this.loginForm.get('showForm')?.setValue(false);

    }
    else {
      this.showRegisterComponent = false;
      this.loginForm.get('showForm')?.setValue(true);
    }
  }

  get email() {
    return this.loginForm.get('email')!;
  }
  get password() {
    return this.loginForm.get('password')!;
  }

  submitForm() {
    if (this.email.errors && this.password.errors) {
      this.toastr.error('Please enter your email and password', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
    }
     else if (this.email.invalid) {
      this.toastr.error('please enter a valid email address', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
    }
    else {
      this.authenticate(this.loginForm.value);

    }

  }
  authenticate(userData: { email: string; password: string }) {
    this._HttpClient.post<any>(`${this.baseURL}login`, userData).subscribe({
      next: (res: any) => {
        if (res && res.result) {
          // set auth status and token
          this.$isAuthenticated.next(true);
          this.token = res.access_token;

          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('userToken', res.access_token);
            localStorage.setItem('userData', JSON.stringify(res.user));
          }

          this.$userData.next(res.user);
          this.dialog?.closeAll();
          window.location.reload();
        } else {
          this.$loginError.next(true);
          this.toastr.error(res.message || 'Login failed. Please try again.');
        }
      },
      error: (err: any) => {
        this.$loginError.next(true);

        if (err.error && err.error.message) {
          if(err.error.message === 'User not found'){
            this.toastr.error('User not found', '', {
              disableTimeOut: false,
              titleClass: 'toastr_title',
              messageClass: 'toastr_message',
              timeOut: 5000,
              closeButton: true,
            });
          }
          else if (err.error.message === 'Please verify your account'){
            this.showCodeSignForm = !this.showCodeSignForm;
            this.toastr.error(err.error.message, '', {
              disableTimeOut: false,
              titleClass: 'toastr_title',
              messageClass: 'toastr_message',
              timeOut: 5000,
              closeButton: true,
            });
            // this.loginForm.reset({
            //   showForm: true,
            // });


          }
          else if (err.error.message === 'Unauthorized'){
            this.toastr.error('Incorrect Email or password', '', {
              disableTimeOut: false,
              titleClass: 'toastr_title',
              messageClass: 'toastr_message',
              timeOut: 5000,
              closeButton: true,
            });
          }

        } else if (err.statusText === 'Unauthorized') {
          this.toastr.error(this.transtale.instant('validation.Unauthorized'));
        } else {
          this.toastr.error('An unexpected error occurred. Please try again.');
        }
      },
    });
  }

  closeDiv() {
    this.loginForm.reset({
      email: '',
      password: '',
      rememberMe: false,
      showForm: true,
    });
    this.showResetComponent = false;
    this.showRegisterComponent = false;
    this.dialog?.closeAll();
    this.close.emit();
  }
}
