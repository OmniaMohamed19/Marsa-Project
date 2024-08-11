import { FormGroup } from '@angular/forms';
import { AuthService } from './../../../../../services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})

export class OtpComponent {
  otp!: FormGroup
  constructor(private _AuthService:AuthService){}
  submit(){} 
  changeReqister(value:string){
    this._AuthService.updateRegisterBehavoir(value)
  }
  get code() {
    return this.otp.get('code')!;
  }
}
