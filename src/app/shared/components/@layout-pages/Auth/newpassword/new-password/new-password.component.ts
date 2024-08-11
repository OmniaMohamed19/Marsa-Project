import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http/http.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
})
export class NewPasswordComponent {
  newPassword!: FormGroup;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  isPasswordVisible1 = false;
  isPasswordVisible2 = false;

  constructor(
    private _AuthService: AuthService,
    private _FormBuilder: FormBuilder,
    private _Router: Router,
    private httpService: HttpService,
    private toastr: ToastrService
  ) {}
  initialForm() {
    this.newPassword = this._FormBuilder.group({
      password: ['', Validators.required],
      repassword: ['', Validators.required],
    });
  }

  toggleVisibility1() {
    this.isPasswordVisible1 = !this.isPasswordVisible1;
  }
  toggleVisibility2() {
    this.isPasswordVisible2 = !this.isPasswordVisible2;
  }

  get password() {
    return this.newPassword.get('password')!;
  }
  get repassword() {
    return this.newPassword.get('repassword')!;
  }

  closeForm() {
    this.close.emit(); // Emit the close event
  }

  submit() {
    this.httpService
      .post(environment.marsa, 'password/passwordReset', {
        password: this.newPassword.value['password'],
      })
      .subscribe((res: any) => {
        console.log(res);
        if (!res.result) {
          this.toastr.error(res.message);
        } else {
          this.toastr.success(res.message);
          this._AuthService.logout();
          this._Router.navigateByUrl('/');
        }
      });
  }
  changeReqister(value: string) {
    this._AuthService.updateRegisterBehavoir(value);
    this.submit();
  }
  ngOnInit(): void {
    this.initialForm();
  }
}
