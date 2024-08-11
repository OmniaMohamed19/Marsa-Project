import { Component, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-header-trans',
  templateUrl: './header-trans.component.html',
  styleUrls: ['./header-trans.component.scss']
})
export class HeaderTransComponent {
  // registerBehavoiur: string = 'login'; // Initialize to 'login' or 'signup' based on your requirement
  registerBehavoiur!:string
  signClick: boolean = false;
  constructor(
    private _AuthService:AuthService,
    public translate:TranslateService
    ){
    this._AuthService.getRegisterBehavoir().subscribe((behavoiur:string)=>{
      this.registerBehavoiur=behavoiur
    })
  }
  @HostListener('document:click', ['$event'])
  OnClickSignIn(event: any) {
    if (event.target.matches('.signUpDropdownInvoker')) {
      this.signClick = !this.signClick;
    }
  }
  toggleDropdown() {
    this.signClick = !this.signClick;
  }
}
