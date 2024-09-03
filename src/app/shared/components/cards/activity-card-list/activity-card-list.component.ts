import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-activity-card-list',
  templateUrl: './activity-card-list.component.html',
  styleUrls: ['./activity-card-list.component.scss'],
})
export class ActivityCardListComponent implements OnInit{
  @Input() item: any;
  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.item);
    
  }
  readMore = false;
  constructor(public translate: TranslateService,
    private _httpService: HttpService,
  ) {}
  getRoundedRate(rate: number | null): number {
    if (rate !== null && !isNaN(Number(rate))) {
      return parseFloat(Number(rate).toFixed(1));
    } else {
      return 0;
    }
  }
  addtoFavorits(btn: any,event:any) {
    if (btn.classList.contains('text-red')) {
      
      } else {
        // Add to favorites/wishlist
        this._httpService
        .post(environment.marsa,'Wishlist/add', { trip_id: this.item?.id })
        .subscribe({
          next: (res: any) => {
            console.log(res);
            // btn.classList.add('bg-primary');
            event.target.classList.add('text-red');
            event.target.classList.remove('text-dark');
          }
        });
    }
  }
}
