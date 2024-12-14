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
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      rememberMe: new FormControl(false),
      showForm: new FormControl(true),
    });
    this.authService.registerBehavoir.subscribe((behavior: string) => {
      if (behavior === 'signup') {
        this.showRegisterComponent = true;
      } else {
        this.showRegisterComponent = false;
      }
    });
    this.authService.$loginError.subscribe((res: any) => {
      if (res && this.loginForm.valid) {
        let errorMessage = '';

        if (res.code === 'INVALID_EMAIL') {
          errorMessage = 'Email is incorrect.';
        } else if (res.code === 'INVALID_PASSWORD') {
          errorMessage = 'The password is incorrect.';
        } else {
          errorMessage = 'Incorrect email or password.';
        }

        this.toastr.error(errorMessage, '', {
          disableTimeOut: false,
          titleClass: 'toastr_title',
          messageClass: 'toastr_message',
          timeOut: 5000,
          closeButton: true,
        });
      }
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
    }else if (value == 'otp'){
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
   
    if (this.email.invalid){
      this.toastr.error('please enter a valid email address', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
    }
    if (this.email ==null &&  this.password==null){
      this.toastr.error('Please enter your email and password', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
    }
    else {
      this.authService.authenticate(this.loginForm.value);

    }
  }

  closeDiv() {
    this.loginForm.reset({
      email: '',
      password: '',
      rememberMe: false,
      showForm: true,
    });
    this.dialog?.closeAll();
    this.close.emit();
  }
}
