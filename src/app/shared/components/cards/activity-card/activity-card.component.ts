import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss'],
})
export class ActivityCardComponent {
    
  constructor(public translate: TranslateService,
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
    
    if (btn.classList.contains('bg-primary')) {
      
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
