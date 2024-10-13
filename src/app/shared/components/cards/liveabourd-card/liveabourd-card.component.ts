import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from 'src/app/core/services/http/http.service';
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

  constructor(public translate: TranslateService,
    private _httpService: HttpService,
  ) {
    if (window.screen.width < 768) {
      this.isMobile = true;
    }
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
    if (btn.classList.contains('text-danger')) {
      // Remove from favorites/wishlist
      this._httpService
        .get(environment.marsa, 'Wishlist/delete/'+this.item?.id)
        .subscribe({
          next: (res: any) => {
            console.log(res);
            // console.log(event.target);
            event.target.classList.add('text-danger');
            event.target.classList.remove('text-black-50');
          }
        });
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
