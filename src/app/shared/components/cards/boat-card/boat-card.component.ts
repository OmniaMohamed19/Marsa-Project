import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-boat-card',
  templateUrl: './boat-card.component.html',
  styleUrls: ['./boat-card.component.scss']
})
export class BoatCardComponent {
  @Input() item: any;
  constructor(public translate: TranslateService,
    private _httpService: HttpService,
  ) {}
  addtoFavorits(btn: any,event:any) {
    if (btn.classList.contains('bg-primary')) {
      // Remove from favorites/wishlist
      this._httpService
        .get(environment.marsa, 'Wishlist/delete/'+this.item?.id)
        .subscribe({
          next: (res: any) => {
            console.log(res);
            // console.log(event.target);
            btn.classList.remove('bg-primary');
            event.target.classList.add('text-dark');
            event.target.classList.remove('text-white');
          }
        });
      } else {
        // Add to favorites/wishlist
        this._httpService
        .post(environment.marsa,'Wishlist/add', { trip_id: this.item?.id })
        .subscribe({
          next: (res: any) => {
            console.log(res);
            btn.classList.add('bg-primary');
            event.target.classList.add('text-white');
            event.target.classList.remove('text-dark');
          }
        });
    }
  }
}
