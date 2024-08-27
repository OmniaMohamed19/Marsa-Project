import { Auth } from './../auth';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { CodeService } from '../services/code.service';
import { MatDialog } from '@angular/material/dialog';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
declare const google: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  isPasswordVisible1 = false;
  isPasswordVisible2 = false;
  socialUser!: SocialUser;
  isLoggedin?: boolean;
  idToken :any;
  signupForm!: FormGroup;
  terms: boolean = false;
  showRegisterForm: boolean = true;
  showCodeSignForm: boolean = true;

  constructor(
    private socialAuthService: SocialAuthService,
    private authService: AuthService,
    private fb: FormBuilder,
    private _Router: Router,
    private codeService: CodeService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.initialForm();
  }

  initialForm(): void {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: [
        '',
        [Validators.required, Validators.minLength(8)],
      ],
      country_code: [''],
      role: [0, [Validators.required, Validators.min(1)]],
    });

    this.signupForm.get('role')?.valueChanges.subscribe((value) => {
      this.signupForm
        .get('role')
        ?.setValue(value ? 1 : 0, { emitEvent: false });
    });
  }
  checkTerms(event: any) {
    this.terms = event.target.checked;
  }
  closeRegister() {
    this.dialog?.closeAll();
    this.close.emit(); // Emit the close event
  }

  get CountryISO(): typeof CountryISO {
    return CountryISO;
  }

  toggleVisibility1() {
    this.isPasswordVisible1 = !this.isPasswordVisible1;
  }
  toggleVisibility2() {
    this.isPasswordVisible2 = !this.isPasswordVisible2;
  }

  get SearchCountryField(): typeof SearchCountryField {
    return SearchCountryField;
  }

  get name() {
    return this.signupForm.get('name')!;
  }
  get email() {
    return this.signupForm.get('email')!;
  }
  get phone() {
    return this.signupForm.get('phone')!;
  }
  get password() {
    return this.signupForm.get('password')!;
  }
  get password_confirmation() {
    return this.signupForm.get('password_confirmation')!;
  }

  get role() {
    return this.signupForm.get('role')!;
  }

  register(form: FormGroup) {
    if (form.valid) {
      const model = {
        ...this.signupForm.value,
        phone: this.signupForm.get('phone')?.value['number'],
        country_code: this.signupForm.get('phone')?.value['dialCode'],
      };
      this.authService.register(model).subscribe({
        next: (res: any) => {
          this.showCodeSignForm = !this.showCodeSignForm;
          this.toastr.success(res.message, ' ', {
            disableTimeOut: false,
            titleClass: 'toastr_title',
            messageClass: 'toastr_message',
            timeOut: 5000,
            closeButton: true,
          });
          this.codeService.setUserData(res.user_id);
        },
        error: (err) => {
          this.toastr.error('An error occurred', '', {
            disableTimeOut: false,
            titleClass: 'toastr_title',
            messageClass: 'toastr_message',
            timeOut: 5000,
            closeButton: true,
          });
        },
      });
    } else {
      this.toastr.error('Check Missing Fields', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
    }
  }
  toggleForm(): void {
    this.showRegisterForm = !this.showRegisterForm;
  }

  ngAfterViewInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.idToken = this.socialUser.idToken
    });

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: this.handleCredentialResponse.bind(this)
    });

    google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      { theme: 'outline', size: 'large' }
    );

    google.accounts.id.prompt(); // Display the One Tap dialog
  }



  handleCredentialResponse(response: any) {
    const model = {
      idToken: this.idToken,
      provider: "GOOGLE"
    }
   this.authService.externalLogin(model)
  }

}
