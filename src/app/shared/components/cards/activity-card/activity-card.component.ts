import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http/http.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss'],
})
export class ActivityCardComponent {

  isLogin: boolean = false;

  constructor(public translate: TranslateService,
    private _AuthService: AuthService,
    private toastr: ToastrService,
    private headerService: HeaderService,
    private _httpService: HttpService,
  ) {}
  @Input() item: any;

  getRoundedRate(rate: number | null): number {
    if (rate !== null && !isNaN(Number(rate))) {
      return parseFloat(Number(rate).toFixed(1));
    } else {
      return 0;
    }
  }

  ngOnChanges() {
    // console.log(this.item);
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
    }
    else {
    if (btn.classList.contains('bg-primary')) {

      } else {
        // Add to favorites/wishlist
        this._httpService
        .post(environment.marsa,'Wishlist/add', { trip_id: this.item?.id })
        .subscribe({
          next: (res: any) => {
            console.log(res);
            // btn.classList.add('bg-primary');
            event.target.classList.add('text-danger');
            event.target.classList.remove('text-black-50');
            // event.target.classList.remove('text-dark');
          }
        });
    }
  }
  }
}
