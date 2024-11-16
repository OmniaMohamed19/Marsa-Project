import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http/http.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-liveabourd-card',
  templateUrl: './liveabourd-card.component.html',
  styleUrls: ['./liveabourd-card.component.scss'],
})
export class LiveabourdCardComponent {
  @Input() item: any;
  readMore = false;
  isMobile = false;
  isLogin: boolean = false;

  constructor(public translate: TranslateService,
    private _AuthService: AuthService,
    private toastr: ToastrService,
    private headerService: HeaderService,
    private _httpService: HttpService,
  ) {
    if (window.screen.width < 768) {
      this.isMobile = true;
    }
  }
  ngOnInit(): void {
    this._AuthService.$isAuthenticated.subscribe((isAuth: any) => {
      this.isLogin = isAuth;
    });
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  getRoundedRate(rate: number | null): number {
    if (rate !== null && !isNaN(Number(rate))) {
      return parseFloat(Number(rate).toFixed(1));
    } else {
      return 0;
    }
  }

  getObjectKeys(obj: any): string[] {
    if (!obj || typeof obj !== 'object') {
      return [];
    }
    return Object.keys(obj);
  }
  addtoFavorits(btn: any,event:any) {
    if (!this.isLogin) {
      this.toastr.info('Please login first', '', {
        disableTimeOut: false,
        titleClass: 'toastr_title',
        messageClass: 'toastr_message',
        timeOut: 5000,
        closeButton: true,
      });
      window.scroll(0, 0);
      this.headerService.toggleDropdown();
    } else {
    if (btn.classList.contains('text-danger')) {
      // Remove from favorites/wishlist
      // this._httpService
      //   .get(environment.marsa, 'Wishlist/delete/'+this.item?.id)
      //   .subscribe({
      //     next: (res: any) => {
      //       console.log(res);
      //       // console.log(event.target);
      //       event.target.classList.add('text-danger');
      //       event.target.classList.remove('text-black-50');
      //     }
        // });
      } else {
        // Add to favorites/wishlist
        this._httpService
        .post(environment.marsa,'Wishlist/add', { trip_id: this.item?.id })
        .subscribe({
          next: (res: any) => {
            console.log(res);
            // btn.classList.add('bg-primary');
            event.target.classList.add('text-danger');
            event.target.classList.remove('text-dark');
          }
        });
    }
  }
  }
}
